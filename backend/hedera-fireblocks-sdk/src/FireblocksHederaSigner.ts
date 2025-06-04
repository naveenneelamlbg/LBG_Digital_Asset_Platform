import {
  AccountBalance,
  AccountBalanceQuery,
  AccountId,
  AccountInfo,
  AccountInfoQuery,
  AccountRecordsQuery,
  Client,
  Executable,
  Key,
  LedgerId,
  PublicKey,
  Signer,
  SignerSignature,
  Transaction,
  TransactionId,
  TransactionRecord,
  Wallet,
} from "@hashgraph/sdk";
import {
  FireblocksHederaClient,
  signMultipleMessages,
} from "./FireblocksHederaClient";
import { Fireblocks } from "@fireblocks/ts-sdk";
import { FireblocksHederaSignerAdditionalFunctionality } from "./type";

/**
 * A signer that uses Fireblocks as the signing functionality.
 * This signer implements certain fucntions following {@link Wallet} implementation
 */
export class FireblocksHederaSigner
  implements Signer, FireblocksHederaSignerAdditionalFunctionality
{
  private accountId: string;
  private vaultAccountPublicKey: Buffer = Buffer.from([]);

  private ledgerId: LedgerId;
  private network: { [key: string]: string | AccountId };
  private mirrorNetwork: string[];
  private client: Client;
  private publicKey: PublicKey;

  private cachedTransactionPayloadSignatures: {
    [bodyBytes: string]: Uint8Array;
  } = {};

  constructor(
    private fireblocksSDK: Fireblocks,
    private assetId: string,
    private vaultAccountId: number,
    testnet: boolean = false,
    client?: FireblocksHederaClient,
    ledgerId?: LedgerId,
    network?: { [key: string]: string | AccountId },
    mirrorNetwork?: string[]
  ) {
    if (
      (!client && !(ledgerId || network || mirrorNetwork)) ||
      (client && ledgerId && network && mirrorNetwork)
    ) {
      throw new Error(
        "Must provide (ledgerId, network and mirrorNetwork) or client (either of the values) in FireblocksHederaSigner."
      );
    }

    if (ledgerId && network && mirrorNetwork) {
      this.ledgerId = ledgerId;
      this.network = network;
      this.mirrorNetwork = mirrorNetwork;
      this.client = (testnet ? Client.forTestnet : Client.forMainnet)();
    }

    if (client) {
      this.ledgerId = client.ledgerId;
      this.network = client.network;
      this.mirrorNetwork = client.mirrorNetwork;
      this.client = client;
    }
  }
  /**
   * A method that caches signatures for multiple nodes usage.
   * @param transaction - hbar transaction
   */
  public async preSignTransaction<T extends Transaction>(
    transaction: T
  ): Promise<void> {
    const allBodyBytes: Uint8Array[] = [];
    transaction.setTransactionId(TransactionId.generate(this.accountId));
    if (!transaction.isFrozen()) {
      transaction.freezeWith(this.client);
    }
    //@ts-ignore
    transaction._transactionIds.setLocked();
    transaction._nodeAccountIds.setLocked();
    transaction._signedTransactions.list.forEach((signedTx) =>
      allBodyBytes.push(signedTx.bodyBytes ?? Buffer.alloc(0))
    );
    const messagesToSign = allBodyBytes.filter(
      (bodyBytes) => bodyBytes.length !== 0
    );

    const signatures = await signMultipleMessages(
      messagesToSign,
      this.vaultAccountId,
      this.fireblocksSDK,
      this.assetId,
      this.cachedTransactionPayloadSignatures,
      `Signing ${transaction.constructor.name} with ${allBodyBytes.length} payloads for ${allBodyBytes.length} nodes`
    );
    // const publicKey = PublicKey.fromBytesED25519(this.vaultAccountPublicKey);
    for (
      let i = 0, sigCounter = 0;
      i < transaction._signedTransactions.length;
      i++
    ) {
      const signedTransaction = transaction._signedTransactions.list[i];
      if (!signedTransaction.bodyBytes) {
        continue;
      }
      if (signedTransaction.sigMap == null) {
        signedTransaction.sigMap = {};
      }
      if (signedTransaction.sigMap.sigPair == null) {
        signedTransaction.sigMap.sigPair = [];
      }
      // signedTransaction.sigMap.sigPair.push(publicKey._toProtobufSignature(signatures[sigCounter]));

      // Cache the signatures so that when the transaction is actually executed we will simply pop them from the cache instead
      const bodyBytesHex =
        signedTransaction.bodyBytes.length > 0
          ? Buffer.from(signedTransaction.bodyBytes).toString("hex")
          : "";
      if (bodyBytesHex !== "") {
        this.cachedTransactionPayloadSignatures[bodyBytesHex] =
          signatures[sigCounter];
      }

      sigCounter++;
    }

    // We freeze the transaction and remove the operator from the transaction so that when it runs
    // _beforeExecute it won't try to sign.
    transaction.freezeWith(this.client);
    transaction._operator = null;
  }

  async getPublicKey(): Promise<PublicKey> {
    if (this.publicKey) {
      return this.publicKey;
    }

    const { publicKey } = (
      await this.fireblocksSDK.vaults.getPublicKeyInfoForAddress({
        vaultAccountId: `${this.vaultAccountId}`,
        assetId: this.assetId,
        change: 0,
        addressIndex: 0,
      })
    ).data;

    this.publicKey = PublicKey.fromBytesED25519(
      Buffer.from(publicKey.replace("0x", ""), "hex")
    );
    return this.publicKey;
  }

  async init() {
    if (this.vaultAccountPublicKey.length != 0) {
      return;
    }
    const vaultAddresses = (
      await this.fireblocksSDK.vaults.getVaultAccountAssetAddressesPaginated({
        vaultAccountId: `${this.vaultAccountId}`,
        assetId: this.assetId,
      })
    ).data.addresses;
    if (vaultAddresses.length === 0) {
      console.log(
        `Vault account ${this.vaultAccountId} does not have an ${this.assetId} wallet in it.`
      );
      return;
    }
    this.accountId = vaultAddresses[0].address;

    this.vaultAccountPublicKey = Buffer.from(
      (
        await this.fireblocksSDK.vaults.getPublicKeyInfoForAddress({
          vaultAccountId: `${this.vaultAccountId}`,
          assetId: this.assetId,
          change: 0,
          addressIndex: 0,
        })
      ).data.publicKey.replace("0x", ""),
      "hex"
    );
  }

  public getLedgerId(): LedgerId {
    return this.ledgerId;
  }

  public getFireblocksAccountId(): Promise<AccountId> {
    return new Promise((r) => r(AccountId.fromString(this.accountId)));
  }

  public getAccountId(): AccountId {
    return AccountId.fromString(this.accountId);
  }

  public getAccountKey(): Key {
    return PublicKey.fromBytesED25519(this.vaultAccountPublicKey);
  }

  public getNetwork(): { [key: string]: string | AccountId } {
    return this.network;
  }

  public getMirrorNetwork(): string[] {
    return this.mirrorNetwork;
  }

  public async getAccountBalance(): Promise<AccountBalance> {
    return await new AccountBalanceQuery()
      .setAccountId(this.accountId)
      .execute(this.client);
  }

  public async getAccountInfo(): Promise<AccountInfo> {
    return await new AccountInfoQuery()
      .setAccountId(this.accountId)
      .execute(this.client);
  }

  public async getAccountRecords(): Promise<TransactionRecord[]> {
    return await new AccountRecordsQuery()
      .setAccountId(this.accountId)
      .execute(this.client);
  }

  public async sign(messages: Uint8Array[]): Promise<SignerSignature[]> {
    const publicKey: PublicKey = PublicKey.fromBytesED25519(
      this.vaultAccountPublicKey
    );
    const accountId: AccountId = AccountId.fromString(this.accountId);
    const signatures: Uint8Array[] = await signMultipleMessages(
      messages,
      this.vaultAccountId,
      this.fireblocksSDK,
      this.assetId,
      this.cachedTransactionPayloadSignatures
    );
    return signatures.map(
      (signature) =>
        new SignerSignature({
          publicKey,
          signature,
          accountId,
        })
    );
  }

  public async signTransaction<T extends Transaction>(
    transaction: T
  ): Promise<T> {
    await this.init();
    const pubKey = PublicKey.fromBytesED25519(this.vaultAccountPublicKey);
    return await transaction.signWith(
      pubKey,
      (async (message: Uint8Array): Promise<Uint8Array> => {
        return (
          await signMultipleMessages(
            [message],
            this.vaultAccountId,
            this.fireblocksSDK,
            this.assetId,
            this.cachedTransactionPayloadSignatures
          )
        )[0];
      }).bind(this)
    );
  }

  public async checkTransaction<T extends Transaction>(
    transaction: T
  ): Promise<T> {
    const transactionId: TransactionId = transaction.transactionId;
    const accountId: AccountId = AccountId.fromString(this.accountId);
    if (
      transactionId != null &&
      transactionId.accountId != null &&
      transactionId.accountId.compare(accountId) != 0
    ) {
      throw new Error(
        "transaction's ID constructed with a different account ID"
      );
    }
    return Promise.resolve(transaction);
  }

  public async populateTransaction<T extends Transaction>(
    transaction: T
  ): Promise<T> {
    const accountId = AccountId.fromString(this.accountId);
    transaction._freezeWithAccountId(accountId);
    if (transaction.transactionId == null) {
      transaction.setTransactionId(TransactionId.generate(this.accountId));
    }
    if (
      transaction.nodeAccountIds != null &&
      transaction.nodeAccountIds.length != 0
    ) {
      return Promise.resolve(transaction.freeze());
    }
    return Promise.resolve(transaction);
  }

  public async call<RequestT, ResponseT, OutputT>(
    request: Executable<RequestT, ResponseT, OutputT>
  ): Promise<OutputT> {
    throw new Error(
      "The Fireblocks signer does not support any call operation."
    );
  }
}
