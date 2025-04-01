import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { CreateContractDto, CreateUserDto, GetUserTokenDto, MintDto, PurchaseDto, RedeemDto, TransferDto } from './token.dto';

@ApiTags('token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.tokenService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Generate user token' })
  @ApiResponse({ status: 200, description: 'User token generated successfully.' })
  @Get('generateUserToken')
  async generateUserToken(@Query() query: GetUserTokenDto) {
    const token = await this.tokenService.generateUserToken(query.userId);
    return { token };
  }


  @ApiOperation({ summary: 'List user rights' })
  @ApiResponse({ status: 200, description: 'List of user rights retrieved successfully.' })
  @Get('listUserRights')
  async listUserRights() {
    const parties = await this.tokenService.listUserRights();
    return parties;
  }

  @ApiOperation({ summary: 'Get list of parties' })
  @ApiResponse({ status: 200, description: 'List of parties retrieved successfully.' })
  @Get()
  async getParties() {
    const parties = await this.tokenService.getParties();
    return parties;
  }

  @ApiOperation({ summary: 'List users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.' })
  @Get("listUsers")
  async listUsers() {
    const parties = await this.tokenService.listUsers();
    return parties;
  }


  @ApiOperation({ summary: 'Get user contracts' })
  @ApiResponse({ status: 200, description: 'User contracts retrieved successfully.' })
  @Get('getUserContracts')
  async getUserContracts() {
    const contracts = await this.tokenService.getUserContracts();
    return contracts;
  }


  @ApiOperation({ summary: 'Create a contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully.' })
  @Post('create')
  async createContract(@Body() createContractDto: CreateContractDto) {
    return this.tokenService.createContract(createContractDto);
  }

  @ApiOperation({ summary: 'Mint tokens' })
  @ApiResponse({ status: 200, description: 'Tokens minted successfully.' })
  @Post('mint')
  async mintToken(@Body() mintDto: MintDto) {
    return this.tokenService.mintToken(mintDto);
  }

  @ApiOperation({ summary: 'Transfer tokens' })
  @ApiResponse({ status: 200, description: 'Tokens transferred successfully.' })
  @Post('transfer')
  async transferToken(@Body() transferDto: TransferDto) {
    return this.tokenService.transferToken(transferDto);
  }

  @ApiOperation({ summary: 'Redeem tokens' })
  @ApiResponse({ status: 200, description: 'Tokens redeemed successfully.' })
  @Post('redeem')
  async redeemToken(@Body() redeemDto: RedeemDto) {
    return this.tokenService.redeemToken(redeemDto);
  }

  // @ApiOperation({ summary: 'Purchase tokens' })
  // @ApiResponse({ status: 200, description: 'Tokens purchased successfully.' })
  // @Post('purchase')
  // async purchaseToken(@Body() purchaseDto: PurchaseDto) {
  //   return this.tokenService.purchaseToken(purchaseDto);
  // }
}