const fs = require('fs');
const path = require('path');
const { FireblocksConfig } = require('@hashgraph/hedera-custodians-integration');

const privateKey = fs.readFileSync(path.join("../../wallet_service/src/resources", 'editor_sandbox_lbg_user_secret.key'), 'utf8');

const config = new FireblocksConfig(
  "68f17824-2bc4-4803-b573-8d36a562f72a",
  privateKey,
  "https://sandbox-api.fireblocks.io/",
  "1",
  "HBAR_TEST"
);

module.exports = config;
