import { Controller, Post, Body, HttpStatus, Get } from '@nestjs/common';
import { TokenService } from './token.service';
import {
  OnChainIdCreationDto,
  AddClaimTopicDto,
  AddClaimDto,
  RegisterIdentityDto,
  MintTokensDto,
  RemoveClaimTopicDto,
  AddTrustedIssuerClaimTopicsDto,
  UpdateTrustedIssuerClaimTopicsDto,
  GetClaimTopicsDto,
  GetUserClaims,
  GetUserTokens,
  GetTokenDetails
} from './token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @Post('create-onchain-identity')
  async createOnChainId(@Body() dto: OnChainIdCreationDto) {
    const result = await this.tokenService.createOnChainId(dto);
    return {
      statusCode: HttpStatus.OK,
      message: `Identity has been created successfully, please use response address as identity of this user ${dto.address} `,
      ...result
    };
  }


  // @Post('add-key')
  // async addKey(@Body() dto: AddKeyDto) {
  //   const receipt = await this.tokenService.addKey(dto);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Key added successfully',
  //     receipt
  //   };
  // }

  @Post('add-claim')
  async addClaim(@Body() dto: AddClaimDto) {
    const receipt = await this.tokenService.addClaim(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Claim added successfully for the user with the signature of the issuer, please make sure issuer is trusted to the token and has claims',
      receipt
    };
  }

  @Post('add-claim-topic')
  async addClaimTopic(@Body() dto: AddClaimTopicDto) {
    const receipt = await this.tokenService.addClaimTopic(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Claim topic added successfully for the token',
      receipt
    };
  }

  @Get('get-claim-topics')
  async getClaimTopics(@Body() dto: GetClaimTopicsDto) {
    const receipt = await this.tokenService.getClaimTopics(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Claims retrieved successfully',
      receipt
    };
  }

  @Get('get-user-claims')
  async getUserClaims(@Body() dto: GetUserClaims) {
    const receipt = await this.tokenService.getUserClaims(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User Claims for the topic provided retrieved successfully',
      receipt
    };
  }

  @Get('get-user-tokens')
  async getUserTokenBalance(@Body() dto: GetUserTokens) {
    const receipt = await this.tokenService.getUserTokenBalance(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User token balance for the provided user address retrieved successfully',
      receipt
    };
  }

  @Get('get-token-details')
  async getTokenDetails(@Body() dto: GetTokenDetails) {
    const receipt = await this.tokenService.getTokenDetails(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token details for the provided token retrieved successfully',
      receipt
    };
  }

  @Post('add-trusted-issuer-claim-topics')
  async addTrustedIssuerClaimTopics(@Body() dto: AddTrustedIssuerClaimTopicsDto) {
    const receipt = await this.tokenService.addTrustedIssuerClaimTopics(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Trusted issuer with the claims topics added successfully',
      receipt
    };
  }

  @Post('update-trusted-issuer-claim-topics')
  async updateTrustedIssuerClaimTopics(@Body() dto: UpdateTrustedIssuerClaimTopicsDto) {
    const receipt = await this.tokenService.updateTrustedIssuerClaimTopics(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Trusted issuer with the claim topics updated successfully and now he can issue new topic claims',
      receipt
    };
  }

  @Post('remove-claim-topic')
  async removeClaimTopic(@Body() dto: RemoveClaimTopicDto) {
    const receipt = await this.tokenService.removeClaimTopic(dto);
    return {
      statusCode: HttpStatus.OK,
      message: `Claim removed successfully, user won't require this topic claim for the token minting and transfer`,
      receipt
    };
  }

  @Post('register-identity')
  async registerIdentity(@Body() dto: RegisterIdentityDto) {
    const receipt = await this.tokenService.registerIdentity(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Identity registered successfully',
      receipt
    };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() dto: MintTokensDto) {
    const receipt = await this.tokenService.mintTokens(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens minted successfully',
      receipt
    };
  }
}