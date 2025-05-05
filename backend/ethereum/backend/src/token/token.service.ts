import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ethers } from 'ethers';
import { contracts } from "@onchain-id/solidity";
import { Identity, IdentitySDK } from '@onchain-id/identity-sdk';
import 'dotenv/config'
import { ClaimScheme, ClaimTopic } from '@onchain-id/identity-sdk/dist/claim/Claim.interface';
import { AddClaimDto, AddClaimTopicDto, AddTrustedIssuerClaimTopicsDto, ApproveUserTokensForTransfer, BurnTokens, GetClaimTopicsDto, GetTokenDetails, GetUserClaims, GetUserTokens, MintTokensDto, OnChainIdCreationDto, RegisterIdentityDto, RemoveClaimTopicDto, TransferTokens, UpdateTrustedIssuerClaimTopicsDto } from './token.dto';

@Injectable()
export class TokenService {
  private provider;
  private signer: ethers.Signer;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    process.env.deployerPrivateKey ? this.signer = new ethers.Wallet(process.env.deployerPrivateKey, this.provider) : Error("Please set environment variables");
  }

  private async getSigner(name: string) {
    let key: string = process.env[`${name}PrivateKey`] || " ";
    if (key) return new ethers.Wallet(key, this.provider)
  }

  async createOnChainId(body: OnChainIdCreationDto) {
    try {
      const identityFactory = new ethers.ContractFactory(
        contracts.IdentityProxy.abi,
        contracts.IdentityProxy.bytecode,
        this.signer
      );
      let createIdentity = await identityFactory.deploy(
        body.identityImplementationAuthority,
        body.address
      );

      await createIdentity.deployed();

      // const identity = await IdentitySDK.Identity.at(createIdentity.address, { provider: this.provider });

      return {
        address: createIdentity.address,
        tx: createIdentity
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to deploy identity implementation', HttpStatus.BAD_REQUEST);
    }
  }

  async addClaim(
    body: AddClaimDto
  ) {
    try {

      const userSigner = await this.getSigner(body.signer);

      let signKey: string = process.env.claimIssuerSignPrivateKey || "";
      const claimIssuer = new ethers.Wallet(signKey, this.provider);

      // let name="alice"
      // let idAddr: string = process.env[`${name}Identity`] || " ";
      const identity = await Identity.at(body.identityAddress, this.provider);

      // console.log(IdentitySDK.utils.encodeAndHash(['address'], [userSigner?.address]));

      // const addKeyTransaction = await identity.addKey(IdentitySDK.utils.encodeAndHash(['address'], [userSigner?.address]), IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT, IdentitySDK.utils.enums.KeyType.ECDSA, { signer: userSigner });

      // const keys = await identity.getKeysByPurpose(
      //   IdentitySDK.utils.enums.KeyPurpose.MANAGEMENT,
      //   { signer: userSigner }
      // );
      // const hashedAddress = IdentitySDK.utils.encodeAndHash(["address"], [userSigner?.address]);
      // for (const key of keys) {
      //   if (key.key === hashedAddress) {
      //     console.log("The identity has been instantiates we verified the wallet used is a manager of the identity");
      //   }
      // }

      const claimTopics = [ethers.utils.id(body.topic)];

      const claim = {
        identity: body.identityAddress,
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(body.data)),
        issuer: body.claimIssuerContractAddress,
        scheme: body.scheme,
        topic: claimTopics[0] as unknown as number,
        uri: "",
        signature: ""
      };

      claim.signature = await claimIssuer.signMessage(
        ethers.utils.arrayify(
          ethers.utils.keccak256(
            ethers.utils.defaultAbiCoder.encode(['address', 'uint256', 'bytes'], [claim.identity, claim.topic, claim.data]),
          ),
        ),
      );

      // // sign the claim
      // const customSigner = new IdentitySDK.SignerModule({
      //   publicKey: await claimIssuer.publicKey as unknown as PublicKey,
      //   signMessage: claimIssuer.signMessage.bind(userSigner)
      // });
      // await claim.sign(customSigner);

      // let provider = this.provider;
      // emit the claim
      // const tx2 = await identity.getKey(key, { signer: userSigner });

      const tx = await identity.addClaim(claim.topic as ClaimTopic, claim.scheme as ClaimScheme, claim.issuer as string, claim.signature as string, claim.data as string, claim.uri as string, { signer: userSigner });
      await tx.wait();

      return tx;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to add claim', HttpStatus.BAD_REQUEST);
    }
  }

  async addClaimTopic(body: AddClaimTopicDto) {
    try {
      const claimTopics = [ethers.utils.id(body.topic)];
      const registry = new ethers.Contract(
        body.claimTopicsRegistryAddress,
        this.claimTopicsRegistryAbi,
        this.signer
      );

      const tx = await registry.addClaimTopic(claimTopics[0]);
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to add claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async getClaimTopics(body: GetClaimTopicsDto) {
    try {
      // const claimTopics = [ethers.utils.id(body.topic)];
      const registry = new ethers.Contract(
        body.claimTopicsRegistryAddress,
        this.claimTopicsRegistryAbi,
        this.signer
      );

      const tx = await registry.getClaimTopics();
      return tx;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserClaims(body: GetUserClaims) {
    try {
      // const claimTopics = [ethers.utils.id(body.topic)];
      const registry = new ethers.Contract(
        body.identityAddress,
        contracts.Identity.abi,
        this.signer
      );

      const tx = await registry.getClaimIdsByTopic(body.topic);
      return tx;
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserTokenBalance(body: GetUserTokens) {
    try {
      const registry = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        this.signer
      );

      const tx = await registry.balanceOf(body.userAddress);

      let balance = ethers.BigNumber.from(tx._hex).toString();

      return { balance, tx };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get user tokens', HttpStatus.BAD_REQUEST);
    }
  }

  async approveUserTokensForTransfer(body: ApproveUserTokensForTransfer) {
    try {
      const registry = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        this.signer
      );

      const tx = await registry.approve(body.userAddress, body.amount);

      return { tx };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get user tokens', HttpStatus.BAD_REQUEST);
    }
  }

  async transferTokens(body: TransferTokens) {
    try {
      const signer = await this.getSigner(body.signer);
      const registry = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        signer
      );

      const tx = await registry.transfer(body.userAddress, body.amount);

      return { tx };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get user tokens', HttpStatus.BAD_REQUEST);
    }
  }

  async burnTokens(body: BurnTokens) {
    try {
      const signer = await this.getSigner(body.signer);
      const registry = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        signer
      );

      const tx = await registry.burn(body.userAddress, body.amount);

      return { tx };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get user tokens', HttpStatus.BAD_REQUEST);
    }
  }

  async getTokenDetails(body: GetTokenDetails) {
    try {
      const registry = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        this.signer
      );

      const name = await registry.name();
      const symbol = await registry.symbol();
      const owner = await registry.owner();
      const paused = await registry.paused();
      const totalSupplyTx = await registry.totalSupply();
      let totalSupply = ethers.BigNumber.from(totalSupplyTx._hex).toString();

      return { 
        totalSupply,
        name,
        symbol,
        owner,
        paused,
       };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to get user tokens', HttpStatus.BAD_REQUEST);
    }
  }

  async addTrustedIssuerClaimTopics(body: AddTrustedIssuerClaimTopicsDto) {
    try {
      const claimTopics = body.topics.map(
        (topic) => ethers.utils.id(topic)
      );
      const registry = new ethers.Contract(
        body.trustedIssuersRegistryContractAddress,
        this.trustedIssuersRegistryAbi,
        this.signer
      );

      const tx = await registry.addTrustedIssuer(body.claimIssuerContractAddress, claimTopics);
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to add claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async updateTrustedIssuerClaimTopics(body: UpdateTrustedIssuerClaimTopicsDto) {
    try {
      const claimTopics = body.topics.map(
        (topic) => ethers.utils.id(topic)
      );
      const registry = new ethers.Contract(
        body.trustedIssuersRegistryContractAddress,
        this.trustedIssuersRegistryAbi,
        this.signer
      );

      const tx = await registry.updateIssuerClaimTopics(body.claimIssuerContractAddress, claimTopics);
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async removeClaimTopic(body: RemoveClaimTopicDto) {
    try {
      const claimTopics = [ethers.utils.id(body.topic)];
      const registry = new ethers.Contract(
        body.claimTopicsRegistryAddress,
        this.claimTopicsRegistryAbi,
        this.signer
      );

      const tx = await registry.removeClaimTopic(claimTopics[0]);
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to remove claim topic', HttpStatus.BAD_REQUEST);
    }
  }

  async deployImplementationAuthority(identityImplementationAddress: string) {
    try {
      const factory = new ethers.ContractFactory(
        contracts.ImplementationAuthority.abi,
        contracts.ImplementationAuthority.bytecode,
        this.signer
      );

      const contract = await factory.deploy(identityImplementationAddress);
      await contract.waitForDeployment();

      return {
        address: await contract.getAddress()
      };
    } catch (error) {
      throw new HttpException(error.message || 'Failed to deploy implementation authority', HttpStatus.BAD_REQUEST);
    }
  }

  async registerIdentity(
    body: RegisterIdentityDto
  ) {
    try {
      const tokenAgent = await this.getSigner("tokenAgent");

      const storage = new ethers.Contract(
        body.identityRegistryAddress,
        this.identityRegistryAbi,
        tokenAgent
      );

      const tx = await storage.registerIdentity(
        body.userAddress,
        body.userIdentity,
        body.country
      );
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to register identity', HttpStatus.BAD_REQUEST);
    }
  }

  async mintTokens(body: MintTokensDto) {
    try {
      const tokenIssuer = await this.getSigner(body.signer);
      const token = new ethers.Contract(
        body.tokenAddress,
        this.tokenAbi,
        tokenIssuer
      );

      const tx = await token.mint(body.recipientAddress, body.amount);
      return await tx.wait();
    } catch (error) {
      throw new HttpException(error.message || 'Failed to mint tokens', HttpStatus.BAD_REQUEST);
    }
  }


  private tokenAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "bool",
          "name": "_isFrozen",
          "type": "bool"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "AddressFrozen",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "AgentAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "AgentRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_compliance",
          "type": "address"
        }
      ],
      "name": "ComplianceAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_identityRegistry",
          "type": "address"
        }
      ],
      "name": "IdentityRegistryAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_lostWallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_newWallet",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_investorOnchainID",
          "type": "address"
        }
      ],
      "name": "RecoverySuccess",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "TokensFrozen",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "TokensUnfrozen",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "string",
          "name": "_newName",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "string",
          "name": "_newSymbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "_newDecimals",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_newVersion",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_newOnchainID",
          "type": "address"
        }
      ],
      "name": "UpdatedTokenInformation",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "addAgent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_userAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchBurn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_fromList",
          "type": "address[]"
        },
        {
          "internalType": "address[]",
          "name": "_toList",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchForcedTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_userAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchFreezePartialTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_toList",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_userAddresses",
          "type": "address[]"
        },
        {
          "internalType": "bool[]",
          "name": "_freeze",
          "type": "bool[]"
        }
      ],
      "name": "batchSetAddressFrozen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_toList",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_userAddresses",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_amounts",
          "type": "uint256[]"
        }
      ],
      "name": "batchUnfreezePartialTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "compliance",
      "outputs": [
        {
          "internalType": "contract IModularCompliance",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "forcedTransfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "freezePartialTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "getFrozenTokens",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "identityRegistry",
      "outputs": [
        {
          "internalType": "contract IIdentityRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_identityRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_compliance",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_decimals",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_onchainID",
          "type": "address"
        }
      ],
      "name": "init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "isAgent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "isFrozen",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "onchainID",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_lostWallet",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_newWallet",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_investorOnchainID",
          "type": "address"
        }
      ],
      "name": "recoveryAddress",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "removeAgent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_freeze",
          "type": "bool"
        }
      ],
      "name": "setAddressFrozen",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_compliance",
          "type": "address"
        }
      ],
      "name": "setCompliance",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_identityRegistry",
          "type": "address"
        }
      ],
      "name": "setIdentityRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "setName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_onchainID",
          "type": "address"
        }
      ],
      "name": "setOnchainID",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        }
      ],
      "name": "setSymbol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "unfreezePartialTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "version",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ]

  private identityRegistryAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "AgentAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "AgentRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimTopicsRegistry",
          "type": "address"
        }
      ],
      "name": "ClaimTopicsRegistrySet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "investorAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint16",
          "name": "country",
          "type": "uint16"
        }
      ],
      "name": "CountryUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "investorAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "contract IIdentity",
          "name": "identity",
          "type": "address"
        }
      ],
      "name": "IdentityRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "investorAddress",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "contract IIdentity",
          "name": "identity",
          "type": "address"
        }
      ],
      "name": "IdentityRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "identityStorage",
          "type": "address"
        }
      ],
      "name": "IdentityStorageSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "contract IIdentity",
          "name": "oldIdentity",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "contract IIdentity",
          "name": "newIdentity",
          "type": "address"
        }
      ],
      "name": "IdentityUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "trustedIssuersRegistry",
          "type": "address"
        }
      ],
      "name": "TrustedIssuersRegistrySet",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "addAgent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_userAddresses",
          "type": "address[]"
        },
        {
          "internalType": "contract IIdentity[]",
          "name": "_identities",
          "type": "address[]"
        },
        {
          "internalType": "uint16[]",
          "name": "_countries",
          "type": "uint16[]"
        }
      ],
      "name": "batchRegisterIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "contains",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "deleteIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "identity",
      "outputs": [
        {
          "internalType": "contract IIdentity",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "identityStorage",
      "outputs": [
        {
          "internalType": "contract IIdentityRegistryStorage",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trustedIssuersRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_claimTopicsRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_identityStorage",
          "type": "address"
        }
      ],
      "name": "init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "investorCountry",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "isAgent",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        }
      ],
      "name": "isVerified",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "issuersRegistry",
      "outputs": [
        {
          "internalType": "contract ITrustedIssuersRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "contract IIdentity",
          "name": "_identity",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_country",
          "type": "uint16"
        }
      ],
      "name": "registerIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agent",
          "type": "address"
        }
      ],
      "name": "removeAgent",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_claimTopicsRegistry",
          "type": "address"
        }
      ],
      "name": "setClaimTopicsRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_identityRegistryStorage",
          "type": "address"
        }
      ],
      "name": "setIdentityRegistryStorage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_trustedIssuersRegistry",
          "type": "address"
        }
      ],
      "name": "setTrustedIssuersRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "topicsRegistry",
      "outputs": [
        {
          "internalType": "contract IClaimTopicsRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "_country",
          "type": "uint16"
        }
      ],
      "name": "updateCountry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_userAddress",
          "type": "address"
        },
        {
          "internalType": "contract IIdentity",
          "name": "_identity",
          "type": "address"
        }
      ],
      "name": "updateIdentity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  private claimTopicsRegistryAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "claimTopic",
          "type": "uint256"
        }
      ],
      "name": "ClaimTopicAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "claimTopic",
          "type": "uint256"
        }
      ],
      "name": "ClaimTopicRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_claimTopic",
          "type": "uint256"
        }
      ],
      "name": "addClaimTopic",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getClaimTopics",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_claimTopic",
          "type": "uint256"
        }
      ],
      "name": "removeClaimTopic",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  private trustedIssuersRegistryAbi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "contract IClaimIssuer",
          "name": "trustedIssuer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "claimTopics",
          "type": "uint256[]"
        }
      ],
      "name": "ClaimTopicsUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "contract IClaimIssuer",
          "name": "trustedIssuer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "claimTopics",
          "type": "uint256[]"
        }
      ],
      "name": "TrustedIssuerAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "contract IClaimIssuer",
          "name": "trustedIssuer",
          "type": "address"
        }
      ],
      "name": "TrustedIssuerRemoved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "contract IClaimIssuer",
          "name": "_trustedIssuer",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_claimTopics",
          "type": "uint256[]"
        }
      ],
      "name": "addTrustedIssuer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IClaimIssuer",
          "name": "_trustedIssuer",
          "type": "address"
        }
      ],
      "name": "getTrustedIssuerClaimTopics",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTrustedIssuers",
      "outputs": [
        {
          "internalType": "contract IClaimIssuer[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "claimTopic",
          "type": "uint256"
        }
      ],
      "name": "getTrustedIssuersForClaimTopic",
      "outputs": [
        {
          "internalType": "contract IClaimIssuer[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_claimTopic",
          "type": "uint256"
        }
      ],
      "name": "hasClaimTopic",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "init",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_issuer",
          "type": "address"
        }
      ],
      "name": "isTrustedIssuer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IClaimIssuer",
          "name": "_trustedIssuer",
          "type": "address"
        }
      ],
      "name": "removeTrustedIssuer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract IClaimIssuer",
          "name": "_trustedIssuer",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_claimTopics",
          "type": "uint256[]"
        }
      ],
      "name": "updateIssuerClaimTopics",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}