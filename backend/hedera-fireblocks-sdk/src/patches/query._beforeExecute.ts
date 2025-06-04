import { proto } from "@hashgraph/proto";
import {
  TransactionId,
  AccountId,
  Hbar,
  MaxQueryPaymentExceeded,
  Long,
  Client,
} from "@hashgraph/sdk";
import { ClientOperator } from "@hashgraph/sdk/lib/client/Client";

export async function _beforeExecute(client: Client) {
  // If we're executing this query multiple times the the payment transaction ID list
  // will already be set
  if (this._paymentTransactions.length > 0) {
    return;
  }

  // Check checksums if enabled
  if (client.isAutoValidateChecksumsEnabled()) {
    this._validateChecksums(client);
  }

  // If the nodes aren't set, set them.
  if (this._nodeAccountIds.isEmpty) {
    this._nodeAccountIds.setList(client._network.getNodeAccountIdsForExecute());
  }

  // Save the operator
  this._operator = this._operator != null ? this._operator : client._operator;

  // If the payment transaction ID is not set
  if (this._paymentTransactionId == null) {
    // And payment is required
    if (this._isPaymentRequired()) {
      // And the client has an operator
      if (this._operator != null) {
        // Generate the payment transaction ID
        this._paymentTransactionId = TransactionId.generate(
          this._operator.accountId
        );
      } else {
        // If payment is required, but an operator did not exist, throw an error
        throw new Error(
          "`client` must have an `operator` or an explicit payment transaction must be provided"
        );
      }
    } else {
      // If the payment transaction ID is not set, but this query doesn't require a payment
      // set the payment transaction ID to an empty transaction ID.
      // FIXME: Should use `TransactionId.withValidStart()` instead
      this._paymentTransactionId = TransactionId.generate(new AccountId(0));
    }
  }

  let cost = new Hbar(0);

  const maxQueryPayment =
    this._maxQueryPayment != null
      ? this._maxQueryPayment
      : client.defaultMaxQueryPayment;

  if (this._queryPayment != null) {
    cost = this._queryPayment;
  } else if (
    this._paymentTransactions.length === 0 &&
    this._isPaymentRequired()
  ) {
    // If the query payment was not explictly set, fetch the actual cost.
    const actualCost = await this.getCost(client);

    // Confirm it's less than max query payment
    if (
      maxQueryPayment.toTinybars().toInt() < actualCost.toTinybars().toInt()
    ) {
      throw new MaxQueryPaymentExceeded(actualCost, maxQueryPayment);
    }

    cost = actualCost;
    if (this._logger) {
      this._logger.debug(
        `[${this._getLogId()}] received cost for query ${cost.toString()}`
      );
    }
  }

  // Set the either queried cost, or the original value back into `queryPayment`
  // in case a user executes same query multiple times. However, users should
  // really not be executing the same query multiple times meaning this is
  // typically not needed.
  this._queryPayment = cost;

  // Not sure if we should be overwritting this field tbh.
  this._timestamp = Date.now();

  this._nodeAccountIds.setLocked();

  // ============= Original =============
  //   // Generate the payment transactions
  //   for (const nodeId of this._nodeAccountIds.list) {
  //     const logId = this._getLogId();
  //     const paymentTransactionId =
  //       /** @type {import("../transaction/TransactionId.js").default} */ this
  //         ._paymentTransactionId;
  //     const paymentAmount = /** @type {Hbar} */ this._queryPayment;

  //     if (this._logger) {
  //       this._logger.debug(
  //         `[${logId}] making a payment transaction for node ${nodeId.toString()} and transaction ID ${paymentTransactionId.toString()} with amount ${paymentAmount.toString()}`
  //       );
  //     }

  //     this._paymentTransactions.push(
  //       await _makePaymentTransaction(
  //         paymentTransactionId,
  //         nodeId,
  //         this._isPaymentRequired() ? this._operator : null,
  //         paymentAmount
  //       )
  //     );
  //   }

  // ============= Patch =============
  const payloadsToSign = [];
  for (const nodeId of this._nodeAccountIds.list) {
    const logId = this._getLogId();
    const paymentTransactionId =
      /** @type {import("../transaction/TransactionId.js").default} */ this
        ._paymentTransactionId;
    const paymentAmount = /** @type {Hbar} */ this._queryPayment;

    if (this._logger) {
      this._logger.debug(
        `[${logId}] making a payment transaction for node ${nodeId.toString()} and transaction ID ${paymentTransactionId.toString()} with amount ${paymentAmount.toString()}`
      );
    }

    payloadsToSign.push(
      await _makePaymentTransactionPayload(
        paymentTransactionId,
        nodeId,
        this._isPaymentRequired() ? this._operator : null,
        paymentAmount
      )
    );
  }

  //@ts-ignore
  const signedPayloads: { [payload: string]: unknown[] } = await client
    .getOperator()!
    //@ts-ignore
    .transactionSigner(payloadsToSign);

  //@ts-ignore
  for (const payload in signedPayloads) {
    const transactionBodyBytes = Buffer.from(payload, "hex");
    const allSignatures = signedPayloads[payload];
    const signedTransaction = {
      bodyBytes: transactionBodyBytes,
      sigMap: {
        sigPair: allSignatures,
      },
    };
    this._paymentTransactions.push({
      signedTransactionBytes:
        proto.SignedTransaction.encode(signedTransaction).finish(),
    });
  }
}

async function _makePaymentTransactionPayload(
  paymentTransactionId: TransactionId,
  nodeId: AccountId,
  operator: ClientOperator,
  paymentAmount: Hbar
) {
  const accountAmounts = [];

  // If an operator is provided then we should make sure we transfer
  // from the operator to the node.
  // If an operator is not provided we simply create an effectively
  // empty account amounts
  if (operator != null) {
    accountAmounts.push({
      accountID: operator.accountId._toProtobuf(),
      amount: paymentAmount.negated().toTinybars(),
    });
    accountAmounts.push({
      accountID: nodeId._toProtobuf(),
      amount: paymentAmount.toTinybars(),
    });
  } else {
    accountAmounts.push({
      accountID: new AccountId(0)._toProtobuf(),
      // If the account ID is 0, shouldn't we just hard
      // code this value to 0? Same for the latter.
      amount: paymentAmount.negated().toTinybars(),
    });
    accountAmounts.push({
      accountID: nodeId._toProtobuf(),
      amount: paymentAmount.toTinybars(),
    });
  }
  /**
   * @type {HashgraphProto.proto.ITransactionBody}
   */
  const body = {
    transactionID: paymentTransactionId._toProtobuf(),
    nodeAccountID: nodeId._toProtobuf(),
    transactionFee: new Hbar(1).toTinybars(),
    transactionValidDuration: {
      seconds: Long.fromNumber(120),
    },
    cryptoTransfer: {
      transfers: {
        accountAmounts,
      },
    },
  };

  return proto.TransactionBody.encode(body).finish();
}
