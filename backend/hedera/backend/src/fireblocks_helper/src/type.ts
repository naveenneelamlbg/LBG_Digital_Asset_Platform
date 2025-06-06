import { AccountId, PublicKey } from "@hashgraph/sdk";
import { BasePath } from "@fireblocks/ts-sdk";

export interface FireblocksHederaSignerAdditionalFunctionality {
  /**
   * Gets the account ID associated with the specified {@link FireblocksHederaClientConfig} provided.
   * Is async because we might need to initiate the client beforehand, if not yet initiated.
   */
  getFireblocksAccountId(): Promise<AccountId>;

  /**
   * Gets the public key associated with the vault account specified in the {@link FireblocksHederaClientConfig} provided.
   * Is async because we might need to initiate the client beforehand, if not yet initiated.
   */
  getPublicKey(): Promise<PublicKey>;
}

export type FireblocksHederaClientConfig = {
  /**
   * The API User's private key's path
   */
  secretKeyPath: string;

  /**
   * The API User's API key
   */
  apiKey: string;

  /**
   * The vault account to use
   */
  vaultAccountId: number;

  /**
   * Is it testnet
   */
  testnet?: boolean;

  /**
   * The API Endpoint to use, if such is relevant (sandbox, production, etc.)
   */
  apiEndpoint?: BasePath;

  /**
   * Hedera SDK allows for signing the same transaction for multiple nodes. This allows us to
   * send the transaction to various nodes until one of them accepts it.
   * This means that for each payload we submit a raw signing transaction.
   * If not specified in the clientConfig, the default will be multiple node transactions.
   */
  maxNumberOfPayloadsPerTransaction?: number;
};
