// src/fireblocks/fireblocks.service.ts
import { Injectable } from '@nestjs/common';
import { Fireblocks, TransferPeerPathType } from '@fireblocks/ts-sdk';
import * as fs from 'fs';
import { AccountId, PrivateKey, PublicKey } from '@hashgraph/sdk';

import { CustodialWalletService, SignatureRequest, FireblocksConfig } from '@hashgraph/hedera-custodians-integration';

@Injectable()
export class FireblocksService {


    private readonly client;
    private readonly signer;

    // private fireblocks: Fireblocks;
    private vaultAccountId = '1'; // Replace wit h your actual vault account ID
    // private FIREBLOCKS_API_SECRET_PATH = "src/token/editor_sandbox_lbg_user_secret.key";
    private FIREBLOCKS_API_SECRET_PATH = "src/token/fireblocks_secret.key";
    // private FIREBLOCKS_API_SECRET_PATH = "src/token/converted_key.pem";

    // private FIREBLOCKS_API_SECRET_DER_PATH = "../private_key.der";

    private privateKey = fs.readFileSync(this.FIREBLOCKS_API_SECRET_PATH, 'utf8');

    private fireblocks = new Fireblocks({
        // apiKey: "68f17824-2bc4-4803-b573-8d36a562f72a",
        apiKey: "514c25b1-8e87-4d4b-8669-65530d139f5c",
        basePath: "https://sandbox-api.fireblocks.io/v1",
        secretKey: this.privateKey,
        // testnet: true,
    });

    private config = new FireblocksConfig(
        // "68f17824-2bc4-4803-b573-8d36a562f72a",
        "514c25b1-8e87-4d4b-8669-65530d139f5c",
        this.privateKey,
        "https://sandbox-api.fireblocks.io/",
        this.vaultAccountId,
        "HBAR_TEST"
    );
    constructor() {
        this.client = new CustodialWalletService(this.config)
    }

    getClient() {
        return this.client;
    }

    async sign(transactionBytes) {
        // const transactionBytes = new Uint8Array([transaction]);
        const request = new SignatureRequest(transactionBytes);
        const signature = await this.client.signTransaction(request);
        // // console.log(signature);
        // let pubKey = await this.fireblocks.vaults.getPublicKeyInfoForAddress({ vaultAccountId: this.vaultAccountId, assetId: "HBAR_TEST", change: 0, addressIndex: 0, compressed: false });

        // // // Example hex public key (replace with your actual key)
        // // const hexPublicKey = 'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a';

        // // // Convert hex to Uint8Array
        // // const publicKeyBytes = Uint8Array.from(Buffer.from(pubKey.data.publicKey as typeof hexPublicKey, 'hex'));

        // // // Now you can use this public key with noble-ed25519
        // // // (async () => {
        // // // Example: verify a signature
        // // const message = new TextEncoder().encode('Hello, world!');

        // // // const isValid = await ed25519.verify(signature, message, publicKeyBytes);
        // // // console.log('Signature valid:', isValid);
        // // // })();


        // const publicKey = PublicKey.fromStringED25519(pubKey?.data?.publicKey as string);

        // const verifySign = publicKey.verify(transactionBytes, signature);

        return signature;
    }

    async signTransaction(transactionBytes) {
        const request = new SignatureRequest(transactionBytes);
        const signature = await this.client.signTransaction(request);
        let pubKey = await this.fireblocks.vaults.getPublicKeyInfoForAddress({ vaultAccountId: this.vaultAccountId, assetId: "HBAR_TEST", change: 0, addressIndex: 0, compressed: false });
        const publicKey = PublicKey.fromStringED25519(pubKey?.data?.publicKey as string);

        return { pubKey: publicKey, signature };


        // const base64Tx = Buffer.from(transactionBytes).toString("base64");

        // // Step 2: Send to Fireblocks
        // const res = await this.fireblocks.transactions.createTransaction(
        //     {
        //         transactionRequest: {
        //             assetId: 'HBAR_TEST',
        //             note: 'Token associate raw signing',
        //             source: {
        //                 type: TransferPeerPathType.VaultAccount,
        //                 id: "vaultAccountId",
        //             },
        //             operation: .RAW,
        //             extraParameters: {
        //                 rawMessageData: {
        //                     messages: [
        //                         {
        //                             content: base64Tx,
        //                         },
        //                     ],
        //                 },
        //             },
        //         }
        //     }
        // );

        // return { pubKey: publicKey, res };
    }


    async getAccountDetailsFromFireblocks(sender: string) {

        const accountId = AccountId.fromString(await this.getAddress());
        let keyStr = fs.readFileSync(this.FIREBLOCKS_API_SECRET_PATH, "utf8");
        let accountKey = await PrivateKey.fromPem(keyStr);;

        // process.env[`${sender}_keyType`] === "ED25519" ? accountKey = PrivateKey.fromStringED25519(process.env[`${sender}_key`] as unknown as string)
        //     : accountKey = PrivateKey.fromStringECDSA(process.env[`${sender}_key`] as unknown as string)

        return { accountId, accountKey };
    }

    // async getAccountInfo() {
    //     const vaultAccounts = await this.fireblocks.vaults.getPagedVaultAccounts({ namePrefix: 'Hedera' });
    //     const account = vaultAccounts.accounts[0]; // Simplified: pick the first one
    //     return {
    //         accountId: account.id,
    //         address: account.assets.find(a => a.id === 'HBAR')?.address || '',
    //     };
    // }

    async getAddress(): Promise<string> {
        let body = {
            // The ID of the vault account to return
            vaultAccountId: this.vaultAccountId,
            // The ID of the asset
            assetId: "HBAR_TEST"
        };

        let res = await this.fireblocks.vaults.getVaultAccountAssetAddressesPaginated(body);
        return res?.data?.addresses?.at(0)?.address || "account not found";
    }

    //retrive vault accounts
    async getVaultPagedAccounts(limit) {
        try {
            const vaults = await this.fireblocks.vaults.getPagedVaultAccounts({
                limit
            });
            console.log(JSON.stringify(vaults.data, null, 2))
            return vaults;
        } catch (e) {
            console.log(e);
        }
    }



    // async signAndSendTransferTransaction(txnDetails: {
    //     assetId: string;
    //     amount: string;
    //     destination: any;
    //     note?: string;
    // }) {
    //     let payload = {
    //         assetId: txnDetails.assetId,
    //         amount: txnDetails.amount,
    //         source: {
    //             type: TransferPeerPathType.VaultAccount,
    //             id: this.vaultAccountId,
    //         },
    //         destination: {
    //             type: TransferPeerPathType.OneTimeAddress,
    //             oneTimeAddress: txnDetails.destination,
    //         },
    //         note: txnDetails.note || 'Hedera Token Transaction',
    //     }

    //     const tx = await this.fireblocks.transactions.createTransaction({ transactionRequest: payload });

    //     return tx;
    // }
}
