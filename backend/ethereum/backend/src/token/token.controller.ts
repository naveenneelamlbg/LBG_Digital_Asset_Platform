import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { TokenService } from './token.service';
import {
  OnChainIdCreationDto,
  DeployImplementationAuthorityDto,
  DeployIdentityProxyDto,
  InitIdentityRegistryDto,
  InitTokenDto,
  AddClaimTopicDto,
  TransferRegistryOwnershipDto,
  AddRegistryAgentDto,
  AddTrustedIssuerDto,
  InitRegistryStorageDto,
  AddStorageAgentDto,
  AddTokenAgentDto,
  AddClaimDto,
  GenerateClaimSignatureDto,
  RegisterIdentityDto,
  MintTokensDto
} from './token.dto';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) { }

  @Post('create-onchain-identity')
  async createOnChainId(@Body() dto: OnChainIdCreationDto) {
    const result = await this.tokenService.createOnChainId(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Identity implementation deployed successfully',
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
      message: 'Claim added successfully',
      receipt
    };
  }

  // @Post('deploy-implementation-authority')
  // async deployImplementationAuthority(@Body() dto: DeployImplementationAuthorityDto) {
  //   const result = await this.tokenService.deployImplementationAuthority(dto.identityImplementationAddress);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Implementation authority deployed successfully',
  //     ...result
  //   };
  // }


  // @Post('add-claim-topic')
  // async addClaimTopic(@Body() dto: AddClaimTopicDto) {
  //   const receipt = await this.tokenService.addClaimTopic(
  //     dto.claimTopicsRegistryAddress,
  //     dto.topic
  //   );
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Claim topic added successfully',
  //     receipt
  //   };
  // }

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