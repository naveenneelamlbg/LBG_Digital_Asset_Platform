process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const fs = require('fs');
const path = require('path');
const { CustodialWalletService, SignatureRequest, FireblocksConfig } = require('@hashgraph/hedera-custodians-integration');

//const privateKey = fs.readFileSync(path.join("../src/resources/", 'editor_sandbox_lbg_user_secret.key'), 'utf8');
const privateKey = fs.readFileSync("../src/resources/editor_sandbox_lbg_user_secret.key", 'utf8');


const config = new FireblocksConfig(
  "68f17824-2bc4-4803-b573-8d36a562f72a",
  privateKey,
  "https://sandbox-api.fireblocks.io/",
  "1",
  "HBAR_TEST"
);

const service = new CustodialWalletService(config);

const transactionBytes = new Uint8Array(["This is test data"]); 
const request = new SignatureRequest(transactionBytes);

async function signTransaction() {
  try {
    const signature = await service.signTransaction(request);
    console.log(signature);
  } catch (error) {
    console.error('Error signing transaction:', error);
  }
}

signTransaction();
