import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";
import { ethers as ethersHardhat} from "hardhat";
import OnchainID from '@onchain-id/solidity';
import { Contract, Signer } from "ethers";

const TokenizationModule = buildModule("TokenizationModule", (m) => {
  const Token = m.contract("Token");
  const ClaimTopicsRegistry = m.contract("ClaimTopicsRegistry");
  const IdentityRegistry = m.contract("IdentityRegistry");
  const IdentityRegistryStorage = m.contract("IdentityRegistryStorage");
  const TrustedIssuersRegistry = m.contract("TrustedIssuersRegistry");
  const ModularCompliance = m.contract("ModularCompliance");
  const DefaultCompliance = m.contract("DefaultCompliance");
  let tokenOID;
  let ClaimIssuerOID;
  let aliceIdentity;


  (async () => {
    const [deployer, tokenIssuer, tokenAgent, tokenAdmin, claimIssuer, aliceWallet, bobWallet, charlieWallet, davidWallet, anotherWallet] =
      await ethersHardhat.getSigners();

    const identityImplementation = m.contract("Identity", OnchainID.contracts.Identity, [deployer.address, true]);
    // console.log("identityImplementation", identityImplementation);
    const identityImplementationAuthority = m.contract("ImplementationAuthority", OnchainID.contracts.ImplementationAuthority, [identityImplementation]);
    // console.log("identityImplementationAuthority", identityImplementationAuthority);
    // const identityFactory = m.contract("Factory", OnchainID.contracts.Factory, [identityImplementationAuthority]);
    // // console.log("identityFactory", identityFactory);
    tokenOID = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, tokenIssuer.address],{id: "tokenOID"});
    ClaimIssuerOID = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, claimIssuer.address],{id: "ClaimIssuerOID"});
    // console.log("tokenOID", tokenOID);
    // m.call(IdentityRegistryStorage, "bindIdentityRegistry", [IdentityRegistry])
    // // await identityRegistryStorage.connect(deployer).bindIdentityRegistry(identityRegistry.address);
    // // await token.connect(deployer).addAgent(tokenAgent.address);
    // const claimTopics = [7];
    // // const claimTopics = [ethers.utils.id('CLAIM_TOPIC')];
    // m.call(ClaimTopicsRegistry, "addClaimTopic", [claimTopics[0]]);
    // let result = m.staticCall(ClaimTopicsRegistry, "getClaimTopics", []);
    // // console.log(result)
    // // await claimTopicsRegistry.connect(deployer).addClaimTopic(claimTopics[0]);

    // ClaimIssuer = m.contract("ClaimIssuer", [claimIssuer.address])
    // // const claimIssuerContract = await ethersHardhat.deployContract('ClaimIssuer', [claimIssuer.address], claimIssuer);
    
    // m.call(ClaimIssuerOID, "addKey", [ethers.keccak256((ethers.AbiCoder.defaultAbiCoder()).encode(['address'], [claimIssuerSigningKey.address])), 3, 1],{from: claimIssuer.address})
    console.log("key for ClaimIssuerOID: ", ethers.keccak256((ethers.AbiCoder.defaultAbiCoder()).encode(['address'], [claimIssuer.address])), 3, 1)
    // // await claimIssuerContract
    // //   .connect(claimIssuer)
    // //   .addKey(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['address'], [claimIssuerSigningKey.address])), 3, 1);

    // m.call(TrustedIssuersRegistry, "addTrustedIssuer", [ClaimIssuer, claimTopics])
    // // await trustedIssuersRegistry.connect(deployer).addTrustedIssuer(claimIssuerContract.address, claimTopics);


    aliceIdentity = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, aliceWallet.address],{id: "aliceIdentity"});

    // // // // const aliceIdentity = await deployIdentityProxy(identityImplementationAuthority, aliceWallet.address, deployer);
    // // // // await aliceIdentity
    // // // //   .connect(aliceWallet)
    // // // //   .addKey(ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(['address'], [aliceActionKey.address])), 2, 1);

    // const bobIdentity = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [tokenIssuer.address, bobWallet.address],{id: "bobIdentity"});
  
    // // const bobIdentity = await deployIdentityProxy(identityImplementationAuthority, bobWallet.address, deployer);
    // const charlieIdentity = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, charlieWallet.address],{id: "charlieIdentity"});
    // // const charlieIdentity = await deployIdentityProxy(identityImplementationAuthority, charlieWallet.address, deployer);
  


    // m.call(ClaimTopicsRegistry, "init");
    // m.call(TrustedIssuersRegistry, "init");
    m.call(IdentityRegistry, "init", [TrustedIssuersRegistry, ClaimTopicsRegistry, IdentityRegistryStorage]);
    m.call(Token, "init", [IdentityRegistry, ModularCompliance, "ltcBond", "ltcToken", 0, tokenIssuer.address ]);

    // m.call(ClaimTopicsRegistry, "addClaimTopic", [7]); // 7 Represents KYC and AML check
    m.call(IdentityRegistry, "transferOwnership", [tokenIssuer.address], {id: "ownershipTransferTokenAgent"}) // For Claim Issuer Identity Contract
    
    m.call(IdentityRegistry, "addAgent", [tokenAgent.address]); //tokenAgent manages the claim topics registry
    // m.call(IdentityRegistry, "registerIdentity", [tokenIssuer.address, IdentityRegistry, 20], {id: "registerTokenIssuerForChainId",  from: tokenIssuer.address})
    
    // m.call(Token, "addAgent", [tokenAgent.address]);

    //  --- Investor identiy ---
    // init IdentityRegistryStorage using admin
    // m.call(IdentityRegistry, "addAgent", [tokenAgent.address], {id: "tokenAgentAddAgent"})
    // // await identityRegistry.connect(deployer).addAgent(tokenAgent.address);
    // m.call(IdentityRegistry, "addAgent", [bobWallet.address], {id: "bobAddAgent"})
    // // await identityRegistry.connect(deployer).addAgent(token);
  
    // let trustedIssuersRegistryUserCheck = m.staticCall(TrustedIssuersRegistry, "isTrustedIssuer",[tokenIssuer.address],0,{id: "trustedIssuersRegistryUserCheck"});
    // // console.log("trustedIssuersRegistryUserCheck: ",trustedIssuersRegistryUserCheck)
    
    m.call(TrustedIssuersRegistry, "addTrustedIssuer",[tokenIssuer.address, [7]])
  
    // let trustedIssuersRegistryUserCheck2 = m.staticCall(TrustedIssuersRegistry, "isTrustedIssuer",[tokenIssuer.address],0,{id: "trustedIssuersRegistryUserCheck2"});
    // // console.log("trustedIssuersRegistryUserCheck2: ",trustedIssuersRegistryUserCheck2)

    

    m.call(IdentityRegistryStorage, "init",[]) //,{from: tokenAdmin.address}
    m.call(IdentityRegistryStorage, "addAgent", [tokenAdmin.address]); //, { from: tokenAdmin.address} //tokenAgent manages the claim topics registry
    
    m.call(Token, "addAgent", [tokenAdmin.address]); //tokenAgent manages the claim topics registry

    // m.call(IdentityRegistryStorage, "addIdentityToStorage", [aliceWallet.address, IdentityRegistry, 20], { from: tokenAdmin.address}); 
    m.call(IdentityRegistryStorage, "addIdentityToStorage", [aliceWallet.address, IdentityRegistry, 20], {id: "registerAliceForChainId",  from: tokenAdmin.address})
    m.call(IdentityRegistryStorage, "addIdentityToStorage", [bobWallet.address, IdentityRegistry, 20], {id: "registerBobForChainId",  from: tokenAdmin.address})


    // m.call(IdentityRegistry, "batchRegisterIdentity", [[aliceWallet.address, bobWallet.address], [aliceWallet.address, bobWallet.address], [42, 666]], {from: tokenAgent.address})
    // // await identityRegistry
    // //   .connect(tokenAgent)
    // //   .batchRegisterIdentity([aliceWallet.address, bobWallet.address] as unknown as AddressLike[], [aliceIdentity.address, bobIdentity.address] as unknown as AddressLike[], [42, 666]);
  
    // const claimForAlice = {
    //   data: ethers.hexlify(ethers.toUtf8Bytes('Some claim public data.')),
    //   issuer: claimIssuer,
    //   topic: 7,
    //   scheme: 1,
    //   identity: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
    //   signature: '',
    // };
    // claimForAlice.signature = await claimIssuer.signMessage(
    //   ethers.getBytes(
    //     ethers.keccak256(
    //       ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'bytes'], [claimForAlice.identity, claimForAlice.topic, claimForAlice.data]),
    //     ),
    //   ),
    // );

  
    // console.log("claimForAlice: ",claimForAlice);
    // m.call(aliceIdentity, "addClaim", [claimForAlice.topic, claimForAlice.scheme, claimForAlice.issuer, claimForAlice.signature, claimForAlice.data, '']);
    // await aliceIdentity
    //   .connect(aliceWallet)
    //   .addClaim(claimForAlice.topic, claimForAlice.scheme, claimForAlice.issuer, claimForAlice.signature, claimForAlice.data, '');
  
    // const claimForBob = {
    //   data: ethers.hexlify(ethers.toUtf8Bytes('Some claim public data.')),
    //   issuer: claimIssuerContract.address,
    //   topic: claimTopics[0],
    //   scheme: 1,
    //   identity: bobIdentity.address,
    //   signature: '',
    // };
    // claimForBob.signature = await claimIssuerSigningKey.signMessage(
    //   ethers.getBytes(
    //     ethers.keccak256(
    //       ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'bytes'], [claimForBob.identity, claimForBob.topic, claimForBob.data]),
    //     ),
    //   ),
    // );
  
    // m.call(bobIdentity, [], )
    // await bobIdentity
    //   .connect(bobWallet)
    //   .addClaim(claimForBob.topic, claimForBob.scheme, claimForBob.issuer, claimForBob.signature, claimForBob.data, '');
  
    m.call(Token, "mint", [aliceWallet.address, 1000], {id: "mintForAlice"})
    // await token.connect(tokenAgent).mint(aliceWallet.address, 1000);

    m.call(Token, "mint", [bobWallet.address, 1000], {id: "mintForBob"})
    // await token.connect(tokenAgent).mint(bobWallet.address, 500);
  
    // m.call(Token, "unpause");
    // await token.connect(tokenAgent).unpause();
    // console.info(
    //   identityImplementation,
    //   identityImplementationAuthority,
    //   identityFactory,
    //   tokenOID,
    //   aliceIdentity,
    // )
  })()

  return {
    Token,
    ClaimTopicsRegistry,
    IdentityRegistry,
    IdentityRegistryStorage,
    TrustedIssuersRegistry,
    compliance: {
      ModularCompliance,
      DefaultCompliance,
    },
    identity: {
      ClaimIssuerOID,
      aliceIdentity,
      tokenOID,
    },
  };
});

export default TokenizationModule;
