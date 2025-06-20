import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TokenCreateTransaction, TokenMintTransaction, TokenBurnTransaction, TokenAssociateTransaction, TokenDissociateTransaction, TransferTransaction, AccountBalanceQuery, TokenInfoQuery, TokenType, TokenSupplyType, TokenUpdateTransaction } from '@hashgraph/sdk';
import * as dotenv from 'dotenv';
import { FireblocksService } from './fireblock.service';

dotenv.config();


@Injectable()
export class TokenService {
    private client;
    private operatorId;
    private operatorKey;

    constructor(private readonly fireblocksService: FireblocksService) {
        this.client = this.fireblocksService.getClient()
    };

    async onModuleInit() {
        await this.client.init();
        const clientSigner = await this.client.getSigner(1);
        this.operatorId = clientSigner.getAccountId();
        this.operatorKey = clientSigner.getAccountKey();
    }

    private async getAccountDetails(sender: string) {
        const clientSigner = await this.client.getSigner(parseInt(sender));
        const accountId = clientSigner.getAccountId();
        const accountKey = clientSigner.getAccountKey();
        return { accountId, accountKey }
    }

    async createToken(body: { tokenName: string; symbol: string; tokenValue: number }) {
        try {
            let tokenCreateTx = await new TokenCreateTransaction()
                .setTokenName(body.tokenName)
                .setTokenSymbol(body.symbol)
                .setTokenType(TokenType.FungibleCommon)
                .setDecimals(0)
                .setInitialSupply(1000)
                .setTreasuryAccountId(this.operatorId)
                .setAdminKey(this.operatorKey)
                .setFreezeDefault(false)
                .setSupplyType(TokenSupplyType.Infinite)
                .setSupplyKey(this.operatorKey)
                .setTokenMemo(`tokenValue:${body.tokenValue}`)
                .freezeWith(this.client);

            // let tokenCreateSign = await tokenCreateTx.sign(this.operatorKey);;
            let tokenCreateSubmit = await tokenCreateTx.execute(this.client);
            let tokenCreateRx = await tokenCreateSubmit.getReceipt(this.client);
            let tokenId = tokenCreateRx.tokenId;
            console.log(`- Created token with ID: ${tokenId} \n`);

            if (!tokenId) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.CREATED, message: 'Token created successfully', tokenCreateRx };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to create token', HttpStatus.BAD_REQUEST, error);
        }
    }

    async mintToken(body: {
        tokenId: string; amount: number;
    }) {
        try {
            const transaction = await new TokenMintTransaction()
                .setTokenId(body.tokenId)
                .setAmount(body.amount)
                .freezeWith(this.client);

            const txResponse = await transaction.execute(this.client);
            const receipt = await txResponse.getReceipt(this.client);
            if (!receipt.status) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.OK, message: 'Token minted successfully', receipt };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to mint token', HttpStatus.BAD_REQUEST, error);
        }
    }

    async burnToken(body: { tokenId: string; amount: number; sender: string }) {
        try {
            const transaction = await new TokenBurnTransaction()
                .setTokenId(body.tokenId)
                .setAmount(body.amount)
                .freezeWith(this.client);

            const txResponse = await transaction.execute(this.client);

            const receipt = await txResponse.getReceipt(this.client);

            if (!receipt.status) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.OK, message: 'Token redeemed successfully', receipt };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to redeem token', HttpStatus.BAD_REQUEST, error);
        }
    }

    async associateToken(body: { tokenId: string; sender: string }) {
        try {
            const clientSigner = await this.client.getSigner(parseInt(body.sender));
            const accountId = clientSigner.getAccountId();

            const transaction = await new TokenAssociateTransaction()
                .setAccountId(accountId)
                .setTokenIds([body.tokenId])
                .freezeWith(this.client)

            this.client.addSigner(body.sender);
            const txResponse = await transaction.execute(this.client);
            const receipt = await txResponse.getReceipt(this.client);

            if (!receipt.status) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.OK, message: 'Token associated successfully', receipt };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to associate token', HttpStatus.BAD_REQUEST, error);
        } finally {
            this.client.removeSigner(body.sender);
        }
    }

    async dissociateToken(body: { tokenId: string; account: string; sender: string }) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(body.sender);
            const transaction = await new TokenDissociateTransaction()
                .setAccountId(accountId)
                .setTokenIds([body.tokenId])
                .execute(this.client);
            this.client.removeSigner("1");
            this.client.addSigner(body.sender)
            const receipt = await transaction.getReceipt(this.client);
            if (!receipt.status) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.OK, message: 'Token dissociated successfully', receipt };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to dissociate token', HttpStatus.BAD_REQUEST, error);
        } finally {
            this.client.removeSigner(body.sender);
        }
    }

    async transferToken(body: {
        tokenId: string; receiver: string; sender: string; amount: number
    }) {
        try {
            const sender = await this.getAccountDetails(body.sender);
            const receiver = await this.getAccountDetails(body.receiver);

            const tokenTransferTx = await new TransferTransaction()
                .addTokenTransfer(body.tokenId, sender.accountId, -body.amount)
                .addTokenTransfer(body.tokenId, receiver.accountId, body.amount)
                .freezeWith(this.client);

            this.client.addSigner(body.sender)

            let tokenTransferSubmit = await tokenTransferTx.execute(this.client);
            let tokenTransferRx = await tokenTransferSubmit.getReceipt(this.client);
            if (!tokenTransferRx.status) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }
            return { statusCode: HttpStatus.OK, message: 'Token transferred successfully', tokenTransferRx };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to transfer token', HttpStatus.BAD_REQUEST, error);
        } finally {
            this.client.removeSigner(body.sender);
        }
    }

    async getAsset(sender: string, tokenId: string) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(sender);

            const query = new AccountBalanceQuery().setAccountId(accountId);
            const balance = await query.execute(this.client);
            if (!balance.tokens) {
                throw new HttpException('Token not found in account', HttpStatus.NOT_FOUND);
            }
            const tokenBalance = balance.tokens.get(tokenId);

            const tokenInfo = await new TokenInfoQuery()
                .setTokenId(tokenId)
                .execute(this.client);

            return {
                statusCode: HttpStatus.OK,
                message: 'Token balance retrieved successfully',
                token: {
                    tokenId: tokenId,
                    name: tokenInfo.name,
                    symbol: tokenInfo.symbol,
                    balance: tokenBalance
                }

                // return { statusCode: HttpStatus.OK, message: 'Account asset retrieved successfully', tokenInfo };
            }
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve account asset', HttpStatus.BAD_REQUEST, error);
        }
    }

    async getAssets(sender: string) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(sender);
            const query = new AccountBalanceQuery().setAccountId(accountId);
            const balance = await query.execute(this.client);
            if (!balance.tokens) {
                throw new HttpException('No assets found', HttpStatus.NOT_FOUND);
            }
            return { statusCode: HttpStatus.OK, message: 'Assets retrieved successfully', assets: balance.tokens };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve assets', HttpStatus.BAD_REQUEST, { cause: new Error(error) });
        }
    }

    async getBalance(sender: string) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(sender);
            const query = new AccountBalanceQuery().setAccountId(accountId);
            const balance = await query.execute(this.client);
            return { statusCode: HttpStatus.OK, message: 'Balance retrieved successfully', balance: balance.hbars.toTinybars() };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve balance', HttpStatus.BAD_REQUEST, error);
        }
    }

    async getAccountBalance(account: string) {
        try {
            const query = new AccountBalanceQuery().setAccountId(account);
            const balance = JSON.parse(await query.execute(this.client) as unknown as string);
            delete balance.tokens;
            return { statusCode: HttpStatus.OK, message: 'Account balance retrieved successfully', balance };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve account balance', HttpStatus.BAD_REQUEST, error);
        }
    }

    async getAccountAssets(account: string) {
        try {
            const query = new AccountBalanceQuery().setAccountId(account);
            const balance = await query.execute(this.client);
            if (!balance.tokens) {
                throw new HttpException('No assets found', HttpStatus.NOT_FOUND);
            }
            return { statusCode: HttpStatus.OK, message: 'Account assets retrieved successfully', assets: balance.tokens };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to retrieve account assets', HttpStatus.BAD_REQUEST, error);
        }
    }

    async purchaseToken(body: { tokenId: string, amount: number, sender: string }) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(body.sender);
            const tokenInfo = await new TokenInfoQuery().setTokenId(body.tokenId).execute(this.client);
            const tokenValue = parseFloat(tokenInfo.tokenMemo.split(':')[1]);

            const totalCost = tokenValue * body.amount;
            const accountBalanceQuery = new AccountBalanceQuery().setAccountId(accountId);
            const accountBalance = await accountBalanceQuery.execute(this.client);

            const transaction = await new TransferTransaction()
                .addHbarTransfer(accountId, -totalCost)
                .addHbarTransfer(this.operatorId, totalCost)
                .addTokenTransfer(body.tokenId, this.operatorId, -body.amount)
                .addTokenTransfer(body.tokenId, accountId, body.amount)
                .freezeWith(this.client)
            // .sign(accountKey);

            this.client.addSigner(body.sender);
            let tokenFundTransferSubmit = await transaction.execute(this.client);
            let tokenFundTransferRx = await tokenFundTransferSubmit.getReceipt(this.client);

            if (!tokenFundTransferRx) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }

            return { statusCode: HttpStatus.OK, message: 'Tokens purchased successfully', tokenFundTransferRx };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to purchase tokens', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            this.client.removeSigner(body.sender);
        }
    }

    async redeemToken(body: { tokenId: string, amount: number, sender: string }) {
        try {
            const { accountId, accountKey } = await this.getAccountDetails(body.sender);
            const tokenInfo = await new TokenInfoQuery().setTokenId(body.tokenId).execute(this.client);
            const tokenValue = parseFloat(tokenInfo.tokenMemo.split(':')[1]);

            const totalRefund = tokenValue * body.amount;

            const transaction = await new TransferTransaction()
                .addHbarTransfer(this.operatorId, -totalRefund)
                .addHbarTransfer(accountId, totalRefund)
                .addTokenTransfer(body.tokenId, accountId, -body.amount)
                .addTokenTransfer(body.tokenId, this.operatorId, body.amount)
                .freezeWith(this.client);

            this.client.addSigner(body.sender);

            let tokenRefundTransferSubmit = await transaction.execute(this.client);
            let tokenRefundTransferRx = await tokenRefundTransferSubmit.getReceipt(this.client);

            if (!tokenRefundTransferRx) {
                throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
            }

            return { statusCode: HttpStatus.OK, message: 'Tokens redeemed successfully', tokenRefundTransferSubmit };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to redeem tokens', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            this.client.removeSigner(body.sender);
        }
    }

    async tokenValueUpdate(tokenId: string, newTokenValue: number) {
        try {
            const transaction = await new TokenUpdateTransaction()
                .setTokenId(tokenId)
                .setTokenMemo(`tokenValue:${newTokenValue}`)
                .freezeWith(this.client);

            let tokenValueUpdateTx = await transaction.execute(this.client);
            let tokenValueUpdateTxRx = await tokenValueUpdateTx.getReceipt(this.client);

            return { statusCode: HttpStatus.OK, message: 'Token value updated successfully', tokenValueUpdateTxRx };
        } catch (error) {
            throw new HttpException(error.message || 'Failed to update token value', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getFireblocksAccounts() {
        let res = await this.client.getFireblocksAccounts()
        return { statusCode: HttpStatus.OK, message: 'Accounts retrieved successfully from fireblocks', res };
    }

    public async getFireblocksTransactions() {
        let res = await this.client.getFireblocksTransactions()
        return { statusCode: HttpStatus.OK, message: 'Transactions retrieved successfully from fireblocks', res };
    }
}