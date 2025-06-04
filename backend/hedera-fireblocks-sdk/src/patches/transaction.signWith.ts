import { PublicKey } from "@hashgraph/sdk";

export async function signWith(
  publicKey: PublicKey,
  transactionSigner: (messages: Uint8Array[]) => Promise<{
    [payload: string]: (typeof PublicKey.prototype._toProtobufSignature)[];
  }>
) {
  // If signing on demand is disabled, we need to make sure
  // the request is frozen
  if (!this._signOnDemand) {
    this._requireFrozen();
  }
  const publicKeyData = publicKey.toBytesRaw();

  // note: this omits the DER prefix on purpose because Hedera doesn't
  // support that in the protobuf. this means that we would fail
  // to re-inflate [this._signerPublicKeys] during [fromBytes] if we used DER
  // prefixes here
  const publicKeyHex = Buffer.from(publicKeyData).toString("hex");
  if (this._signerPublicKeys.has(publicKeyHex)) {
    // this public key has already signed this transaction
    return this;
  }

  // If we add a new signer, then we need to re-create all transactions
  this._transactions.clear();

  // Save the current public key so we don't attempt to sign twice
  this._signerPublicKeys.add(publicKeyHex);

  // If signing on demand is enabled we will save the public key and signer and return
  if (this._signOnDemand) {
    this._publicKeys.push(publicKey);
    this._transactionSigners.push(transactionSigner);
    return this;
  }

  // If we get here, signing on demand is disabled, this means the transaction
  // is frozen and we need to sign all the transactions immediately. If we're
  // signing all the transactions immediately, we need to lock the node account IDs
  // and transaction IDs.
  // Now that I think of it, this code should likely exist in `freezeWith()`?
  this._transactionIds.setLocked();
  this._nodeAccountIds.setLocked();

  // Sign each signed transatcion
  //   for (const signedTransaction of this._signedTransactions.list) {
  //     const bodyBytes = /** @type {Uint8Array} */ signedTransaction.bodyBytes;
  //     const signature = await transactionSigner(bodyBytes);
  //     if (signedTransaction.sigMap == null) {
  //       signedTransaction.sigMap = {};
  //     }
  //     if (signedTransaction.sigMap.sigPair == null) {
  //       signedTransaction.sigMap.sigPair = [];
  //     }
  //     signedTransaction.sigMap.sigPair.push(
  //       publicKey._toProtobufSignature(signature)
  //     );
  //   }
  ///////////////////////
  // Patch Starts Here //
  //////////////////////

  const payloads = [];
  for (const signedTransaction of this._signedTransactions.list) {
    payloads.push(signedTransaction.bodyBytes);
  }
  const signatures = await transactionSigner(payloads);
  for (const signedTransaction of this._signedTransactions.list) {
    const bodyBytesHex = Buffer.from(signedTransaction.bodyBytes).toString(
      "hex"
    );

    if (signedTransaction.sigMap == null) {
      signedTransaction.sigMap = {};
    }
    if (signedTransaction.sigMap.sigPair == null) {
      signedTransaction.sigMap.sigPair = [];
    }
    for (const signature of signatures[bodyBytesHex]) {
      signedTransaction.sigMap.sigPair.push(signature);
    }
  }
  return this;
}
