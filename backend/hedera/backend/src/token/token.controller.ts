import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { TokenService } from './token.service';
import {
  CreateTokenDto,
  MintTokenDto,
  BurnTokenDto,
  PurchaseTokenDto,
  RedeemTokenDto,
  AssociateTokenDto,
  DissociateTokenDto,
  TransferTokenDto,
  GetAccountAssetDto,
  GetAssetsDto,
  GetBalanceDto,
  GetAccountBalanceDto,
  GetAccountAssetsDto,
  GetTransactionHistoryDto
} from './dto/token.dto'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @Post('create')
  createToken(@Body() body: CreateTokenDto) {
    return this.tokenService.createToken(body);
  }

  @Post('mint')
  mintToken(@Body() body: MintTokenDto) {
    return this.tokenService.mintToken(body);
  }

  @Post('burn')
  burnToken(@Body() body: BurnTokenDto) {
    return this.tokenService.burnToken(body);
  }

  @Post('purchase')
  purchaseToken(@Body() body: PurchaseTokenDto) {
    return this.tokenService.purchaseToken(body);
  }

  @Post('redeem')
  redeemToken(@Body() body: RedeemTokenDto) {
    return this.tokenService.redeemToken(body);
  }

  @Post('associate')
  associateToken(@Body() body: AssociateTokenDto) {
    return this.tokenService.associateToken(body);
  }

  @Post('dissociate')
  dissociateToken(@Body() body: DissociateTokenDto) {
    return this.tokenService.dissociateToken(body);
  }

  @Post('transfer')
  transferToken(@Body() body: TransferTokenDto) {
    return this.tokenService.transferToken(body);
  }


  @Get('asset')
  getAccountAsset(@Query() query: GetAccountAssetDto) {
    return this.tokenService.getAsset(query.sender, query.tokenId);
  }

  @Get('assets')
  getAssets(@Query() query: GetAssetsDto) {
    return this.tokenService.getAssets(query.sender);
  }

  @Get('balance')
  getBalance(@Query() query: GetBalanceDto) {
    return this.tokenService.getBalance(query.sender);
  }

  @Get('account-balance')
  getAccountBalance(@Query() query: GetAccountBalanceDto) {
    return this.tokenService.getAccountBalance(query.account);
  }

  @Get('account-assets')
  getAccountAssets(@Query() query: GetAccountAssetsDto) {
    return this.tokenService.getAccountAssets(query.account);
  }

  @Get('fireblocks-accounts')
  getFireblocksAccounts() {
    return this.tokenService.getFireblocksAccounts();
  }

  @Get('fireblocks-transactions')
  getFireblocksTransactions() {
    return this.tokenService.getFireblocksTransactions();
  }
}