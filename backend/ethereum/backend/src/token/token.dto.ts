import { ApiProperty } from '@nestjs/swagger';

export class OnChainIdCreationDto {
  @ApiProperty({ description: 'signer name', example: 'deployer' })
  signer: string;

  @ApiProperty({ description: 'user wallet address', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  address: string;

  @ApiProperty({ description: 'identityImplementationAuthority address', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityImplementationAuthority?: string;
}

export class DeployImplementationAuthorityDto {
  @ApiProperty({ description: 'identityImplementationAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityImplementationAddress: string;
}

export class DeployIdentityProxyDto {
  @ApiProperty({ description: 'implementationAuthorityAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  implementationAuthorityAddress: string;

  @ApiProperty({ description: 'ownerAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  ownerAddress: string;
}

export class InitIdentityRegistryDto {
  @ApiProperty({ description: 'registryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryAddress: string;

  @ApiProperty({ description: 'trustedIssuersRegistryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  trustedIssuersRegistryAddress: string;

  @ApiProperty({ description: 'claimTopicsRegistryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimTopicsRegistryAddress: string;

  @ApiProperty({ description: 'registryStorageAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryStorageAddress: string;
}

export class InitTokenDto {
  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;

  @ApiProperty({ description: 'identityRegistryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityRegistryAddress: string;

  @ApiProperty({ description: 'modularComplianceAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  modularComplianceAddress: string;

  @ApiProperty({ description: 'name', example: 'lloydsBank' })
  name: string;

  @ApiProperty({ description: 'symbol', example: 'lloydsBank' })
  symbol: string;

  @ApiProperty({ description: 'decimals', example: 'lloydsBank' })
  decimals: number;

  @ApiProperty({ description: 'tokenIssuerAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenIssuerAddress: string;
}

export class TransferRegistryOwnershipDto {
  @ApiProperty({ description: 'registryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryAddress: string;

  @ApiProperty({ description: 'newOwnerAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  newOwnerAddress: string;
}

export class AddRegistryAgentDto {
  @ApiProperty({ description: 'registryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryAddress: string;

  @ApiProperty({ description: 'agentAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  agentAddress: string;
}

export class AddTrustedIssuerDto {
  @ApiProperty({ description: 'trustedIssuersRegistryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  trustedIssuersRegistryAddress: string;

  @ApiProperty({ description: 'issuerAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  issuerAddress: string;

  @ApiProperty({ description: 'claim topics', example: '[7]' })
  claimTopics: number[];
}

export class InitRegistryStorageDto {
  @ApiProperty({ description: 'registryStorageAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryStorageAddress: string;
}

export class AddStorageAgentDto {
  @ApiProperty({ description: 'signer name', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'registryStorageAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  registryStorageAddress: string;

  @ApiProperty({ description: 'agentAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  agentAddress: string;
}

export class AddTokenAgentDto {
  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;

  @ApiProperty({ description: 'agentAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  agentAddress: string;
}

export class AddClaimDto {
  @ApiProperty({ description: 'signer name', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'identityProxyAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityAddress: string;

  @ApiProperty({ description: 'topic', example: 'KYC' })
  topic: string;

  @ApiProperty({ description: 'scheme', example: '1' })
  scheme: number;

  @ApiProperty({ description: 'issuerAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  issuerAddress: string;

  @ApiProperty({ description: 'claimIssuerContractAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimIssuerContractAddress: string;

  // @ApiProperty({ description: 'signature', example: '0xc43b42f4d30200b2f03855fcb1dc63defcb0c60b25350ad5fdf60ffe83b81f294fbe7e4440ddddb3ba074100a557e4267b1ebc7692b48c7fea2144fef9716c781c' })
  // signature: string;

  @ApiProperty({ description: 'data', example: 'Some public data' })
  data: string;

  @ApiProperty({ description: 'uri', example: '' })
  uri?: string;
}

export class AddClaimTopicDto {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'claimTopicsRegistry', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimTopicsRegistryAddress: string;

  @ApiProperty({ description: 'topic', example: 'KYC' })
  topic: string;
}

export class GetClaimTopicsDto {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'claimTopicsRegistry', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimTopicsRegistryAddress: string;
}

export class GetUserClaims {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'identityAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityAddress: string;
  
  @ApiProperty({ description: 'topic', example: 'KYC' })
  topic: string;
}

export class GetUserTokens {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;
}

export class ApproveUserTokensForTransfer {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}

export class TransferTokens {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}

export class FreezeTokens {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}


export class TransferApprovedTokens {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  from: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  to: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}

export class BurnTokens {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
  
  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}

export class GetTokenDetails {
  @ApiProperty({ description: 'deployer', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;
}

export class AddTrustedIssuerClaimTopicsDto {
  @ApiProperty({ description: 'signer name', example: 'deployer' })
  signer: string;

  @ApiProperty({ description: 'claimIssuerContractAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimIssuerContractAddress: string;

  @ApiProperty({ description: 'trustedIssuersRegistryContractAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  trustedIssuersRegistryContractAddress: string;

  @ApiProperty({ description: 'topics', example: '[7]' })
  topics: [string];
}

export class UpdateTrustedIssuerClaimTopicsDto {
  @ApiProperty({ description: 'signer name', example: 'deployer' })
  signer: string;

  @ApiProperty({ description: 'claimIssuerContractAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimIssuerContractAddress: string;

  @ApiProperty({ description: 'trustedIssuersRegistryContractAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  trustedIssuersRegistryContractAddress: string;

  @ApiProperty({ description: 'topics', example: '[7]' })
  topics: [string];
}

export class RemoveClaimTopicDto {
  @ApiProperty({ description: 'signer name', example: 'deployer' })
  signer: string;

  @ApiProperty({ description: 'claimTopicsRegistry', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  claimTopicsRegistryAddress: string;

  @ApiProperty({ description: 'topic', example: 'KYC' })
  topic: string;
}

export class GenerateClaimSignatureDto {
  @ApiProperty({ description: 'issuerPrivateKey', example: 'lloydsBank' })
  issuerPrivateKey: string;

  @ApiProperty({ description: 'identityAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityAddress: string;

  @ApiProperty({ description: 'topic', example: 'KYC' })
  topic: number;

  @ApiProperty({ description: 'data', example: '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c' })
  data: string;
}

export class RegisterIdentityDto {
  @ApiProperty({ description: 'signer name', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'identityRegistryAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  identityRegistryAddress: string;

  @ApiProperty({ description: 'userAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userAddress: string;

  @ApiProperty({ description: 'userIdentity', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  userIdentity: string;

  @ApiProperty({ description: 'country', example: '91' })
  country: number;
}

export class MintTokensDto {
  @ApiProperty({ description: 'signer name', example: 'alice' })
  signer: string;

  @ApiProperty({ description: 'tokenAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  tokenAddress: string;

  @ApiProperty({ description: 'recipientAddress', example: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' })
  recipientAddress: string;

  @ApiProperty({ description: 'amount', example: '100' })
  amount: number;
}