import { Hbar, TransferTransaction } from "@hashgraph/sdk";
import { FireblocksHederaClient } from "../src/FireblocksHederaClient";
import { FireblocksHederaClientConfig } from "../src/type";
import { BasePath } from "@fireblocks/ts-sdk";

let client: FireblocksHederaClient;

// code example for hbar transfer from one account to another, examplifying the use case of a single signer and limitation of nodes to a single node

(async () => {
  const clientConfig: FireblocksHederaClientConfig = {
    apiKey: "YOUR_API_KEY_ID",
    secretKeyPath: "/PATH/TO/API/SECRET/KEY",
    vaultAccountId: 0, // update the client's vault account id
    testnet: true,
    apiEndpoint: BasePath.US,
    maxNumberOfPayloadsPerTransaction: 1,
  };
  client = new FireblocksHederaClient(clientConfig);
  await client.init();

  const fromAccountId = await client.getFireblocksAccountId();
  const amount = new Hbar(1);
  const destAddress = "0.0.1234"; // update destination address

  const transaction = new TransferTransaction()
    .addHbarTransfer(fromAccountId, amount.negated())
    .addHbarTransfer(destAddress, amount);
  const txResponse = await transaction.execute(client);
  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);
  //Get the transaction consensus status
  const transactionStatus = receipt.status;
  console.log(
    `Transaction ${txResponse.transactionId.toString()} finished with ${transactionStatus.toString()}`
  );

  client.close();
})().catch((e) => {
  console.log("Failed to do something: ", e);
  console.error(e);
  console.log(JSON.stringify(e, null, 2));
  client.close();
});
