import { Injectable } from '@nestjs/common';
import { BasePath } from '@fireblocks/ts-sdk';
import { FireblocksHederaClient, FireblocksHederaClientConfig } from 'src/fireblocks_helper/src';

@Injectable()
export class FireblocksService {
    private readonly client: FireblocksHederaClient;
    private vaultAccountId = 1; 

    private clientConfig: FireblocksHederaClientConfig = {
        apiKey: "514c25b1-8e87-4d4b-8669-65530d139f5c",
        secretKeyPath: "src/token/fireblocks_secret.key",
        vaultAccountId: this.vaultAccountId, // update the client's vault account id
        testnet: true,
        apiEndpoint: BasePath.Sandbox,
        maxNumberOfPayloadsPerTransaction: 1,
    };
    constructor() {
        this.client = new FireblocksHederaClient(this.clientConfig);
    }

    getClient() {
        return this.client;
    }
}
