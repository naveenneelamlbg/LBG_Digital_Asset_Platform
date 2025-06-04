const { CustodialWalletService, SignatureRequest } = require('@hashgraph/hedera-custodians-integration');
const fireblocksConfig = require('../config/fireblocksConfig.cjs');
const { readFileSync } = require('fs');
const { Fireblocks, TransferPeerPathType } = require("@fireblocks/ts-sdk");
const { Hbar, TransferTransaction, PrivateKey, AccountId, Client } = require("@hashgraph/sdk");

const service = new CustodialWalletService(fireblocksConfig);
const FIREBLOCKS_API_SECRET_PATH = "../src/resources/editor_sandbox_lbg_user_secret.key";

exports.signTransaction = async (transactionBytes) => {
  const request = new SignatureRequest(transactionBytes);
  return await service.signTransaction(request);
};


const fireblocks = new Fireblocks({
  apiKey: "68f17824-2bc4-4803-b573-8d36a562f72a",
  basePath: "https://sandbox-api.fireblocks.io/v1",
  secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, "utf8"),
  testnet: true,
});

exports.createVault = async (vaultName) => {
  const vault = await fireblocks.vaults.createVaultAccount({
    createVaultAccountRequest: {
      name: vaultName,
      hiddenOnUI: false,
      autoFuel: false
    }
  });
  return vault.data;
};

exports.getVaultPagedAccounts = async (limit) => {
  const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
  return vaults.data;
};

exports.transferToken = async (assetId, amount, srcId, destId) => {
  const payload = {
    assetId,
    amount,
    source: {
      type: TransferPeerPathType.VaultAccount,
      id: String(srcId)
    },
    destination: {
      type: TransferPeerPathType.VaultAccount,
      id: String(destId)
    },
    note: "Transfer HBAR"
  };

  const result = await fireblocks.transactions.createTransaction({ transactionRequest: payload });
  return result;
};

exports.getAddress = async (assetId) => {
  const body = {
    vaultAccountId: 1,
    assetId: String(assetId)
  };

  const res = await fireblocks.vaults.getVaultAccountAssetAddressesPaginated(body);
  return res.data.addresses[0].address;
};

exports.transferToAddress = async (destinationAddress) => {
  const operatorIdStr = await exports.getAddress();
  const operatorKeyStr = readFileSync(FIREBLOCKS_API_SECRET_PATH, "utf8");

  const operatorId = AccountId.fromString(operatorIdStr);
  const operatorKey = await PrivateKey.fromPem(operatorKeyStr);
  const client = await Client.forTestnet().setOperator(operatorId, operatorKey);

  const fromAccountId = await exports.getAddress();
  const amount = new Hbar(0.1);
  const destAddress = destinationAddress;

  const transaction = new TransferTransaction()
    .addHbarTransfer(operatorId, amount.negated())
    .addHbarTransfer(destAddress, amount);
  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const transactionStatus = receipt.status;

  return transactionStatus.toString();
};
