import { Injectable } from '@nestjs/common';
import { Ledger } from '@daml/ledger';
import { MintDto, TransferDto, RedeemDto, PurchaseDto } from './token.dto';
import { Token } from '@daml.ts/ledger-0.0.1/lib/Token';
import { escape } from 'querystring';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private ledger: Ledger;
  private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwYXJ0aWNpcGFudF9hZG1pbiIsInNjb3BlIjoiZGFtbF9sZWRnZXJfYXBpIiwiaWF0IjoxNzQzMDU5MzY2fQ.JJLFCk-AaZD8skak0s0cFoafO4eWni9OoLsmPNuWGXI";

  constructor() {
    this.ledger = new Ledger({ token: this.token, httpBaseUrl: 'http://localhost:7575/' });
  }

  async createUser(createUserDto) {
    await this.ledger.createUser(createUserDto.userId, createUserDto.rights, createUserDto.primaryParty);
    const partyResponse = await this.ledger.allocateParty({ identifierHint: createUserDto.name, displayName: createUserDto.name });
    const response = await this.ledger.grantUserRights(createUserDto.userId, [{ type: "CanActAs", party: partyResponse.identifier }]);
    return response;
  }

  async getParties() {
    const response = await this.ledger.listKnownParties();
    return response;
  }

  async listUsers() {
    const response = await this.ledger.listUsers();
    return response;
  }

  async listUserRights() {
    const response = await this.ledger.listUserRights();
    return response;
  }

  async getUserContracts(): Promise<any[]> {
    const contracts = await this.ledger.query(Token);
    return contracts;
  }

  async createContract(createContractDto) {
    return this.ledger.create(Token, createContractDto);
  }

  async mintToken(mintDto: MintDto) {
    const { tokenCid, newAmount } = mintDto;
    return this.ledger.exercise(Token.Mint, tokenCid, { newAmount });
  }

  async transferToken(transferDto: TransferDto) {
    const { owner, tokenCid, newOwner, transferAmount } = transferDto;
    return this.ledger.exercise(Token.Transfer, tokenCid, { newOwner, transferAmount });
  }

  async redeemToken(redeemDto: RedeemDto) {
    const { owner, tokenCid, redeemAmount } = redeemDto;
    return this.ledger.exercise(Token.Redeem, tokenCid, { redeemAmount });
  }

  // async purchaseToken(purchaseDto: PurchaseDto) {
  //   const { owner, tokenCid, buyer, purchaseAmount } = purchaseDto;
  //   return this.ledger.exercise(Token.Purchase, tokenCid, { buyer, purchaseAmount });
  // }

  async generateUserToken(userId: string): Promise<string> {
    const SECRET_KEY = 'a-string-secret-at-least-256-bits-long';
    const payload = {
      "sub": userId,
      "scope": "daml_ledger_api"
    }
    // ledgerId: 'sandbox', // Replace with your actual ledger ID
    // applicationId: 'HTTP-JSON-API-Gateway', // Replace with your actual application ID
    // actAs: ["alice"],
    // admin: true,
    // exp: Math.floor(Date.now() / 1000) + (60 * 60) // Token expires in 1 hour
    this.token = jwt.sign(payload, SECRET_KEY, { algorithm: 'HS256' });
    this.ledger = new Ledger({ token: this.token, httpBaseUrl: 'http://localhost:7575/' });
    return this.token
  }
}