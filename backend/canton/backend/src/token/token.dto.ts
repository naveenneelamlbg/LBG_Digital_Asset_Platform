import { ContractId } from "@daml/types";
import { Token } from "@daml.ts/ledger-0.0.1/lib/Token/module";
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumberString, IsOptional, IsObject } from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ description: 'Template ID of the contract' })
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ description: 'Issuer of the token' })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({ description: 'Owner of the token' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Symbol of the token' })
  @IsString()
  @IsNotEmpty()
  symbol: string;

  @ApiProperty({ description: 'Amount of the token' })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'Name of the token' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Value of the token' })
  @IsNumberString()
  @IsNotEmpty()
  tokenValue: string;

  @ApiProperty({ description: 'Additional payload' })
  @IsOptional()
  @IsObject()
  payload?: object;
}



export class MintDto {
  @ApiProperty({ description: 'Issuer of the token' })
  @IsString()
  @IsNotEmpty()
  issuer: string;

  @ApiProperty({ description: 'Contract ID of the token' })
  @IsString() // Adjust based on actual type of ContractId<Token>
  @IsNotEmpty()
  tokenCid: ContractId<Token>;

  @ApiProperty({ description: 'Amount to mint' })
  @IsNumberString()
  @IsNotEmpty()
  newAmount: string;
}


export class TransferDto {
  @ApiProperty({ description: 'Owner of the token' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Contract ID of the token' })
  @IsString() // Adjust if ContractId<Token> has a specific structure
  @IsNotEmpty()
  tokenCid: ContractId<Token>;

  @ApiProperty({ description: 'New owner of the token' })
  @IsString()
  @IsNotEmpty()
  newOwner: string;

  @ApiProperty({ description: 'Amount to transfer' })
  @IsNumberString()
  @IsNotEmpty()
  transferAmount: string;
}


export class RedeemDto {
  @ApiProperty({ description: 'Owner of the token' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Contract ID of the token' })
  @IsString()
  @IsNotEmpty()
  tokenCid: ContractId<Token>;

  @ApiProperty({ description: 'Amount to redeem' })
  @IsNumberString()
  @IsNotEmpty()
  redeemAmount: string;
}



export class PurchaseDto {
  @ApiProperty({ description: 'Owner of the token' })
  @IsString()
  @IsNotEmpty()
  owner: string;

  @ApiProperty({ description: 'Contract ID of the token' })
  @IsString()
  @IsNotEmpty()
  tokenCid: string;

  @ApiProperty({ description: 'Buyer of the token' })
  @IsString()
  @IsNotEmpty()
  buyer: string;

  @ApiProperty({ description: 'Amount to purchase' })
  @IsNumberString()
  @IsNotEmpty()
  purchaseAmount: string;
}


export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Primary party of the user' })
  @IsString()
  @IsNotEmpty()
  primaryParty: string;

  // @ApiProperty({ description: 'Optional: Rights assigned to the user' })
  // rights?: [];
}



export class GetUserTokenDto {
  @ApiProperty({ description: 'Name of the user', example: 'lloydsBank' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
