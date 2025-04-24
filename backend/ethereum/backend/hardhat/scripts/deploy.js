
async function main() {
    const TokenContract = await ethers.getContractFactory("Token");
    const ClaimTopicsRegistryContract = await ethers.getContractFactory("ClaimTopicsRegistry");
    const IdentityRegistryContract = await ethers.getContractFactory("IdentityRegistry");
    const IdentityRegistryStorageContract = await ethers.getContractFactory("IdentityRegistryStorage");
    // const ClaimIssuerRegistryContract = await ethers.getContractFactory("ClaimIssuerRegistry");
    const TrustedIssuerRegistryContract = await ethers.getContractFactory("TrustedIssuerRegistry");
    const ModularComplianceContract = await ethers.getContractFactory("ModularCompliance");


    // Claim Issuer Registry
    // Trusted Issuer Registry
    // Identity Registry

    // IdentityRegistry Init
    // ---------------------
    // Identity Storage
    // Claim Topics Registry
    
    // Token init
    // ----------
    // Identity Registry address
    // complaince contract address

    // Modular Compliance
    const myContract = await TokenContract.deploy();
    // await myContract.deployed();
    console.log("MyContract deployed to:", TokenContract);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process
            .exit(1);
    });


// write multiple nest.js endpoints using  this hardhat ignition module script:
// example success response: { statusCode: HttpStatus.OK, message: 'Token minted successfully', receipt }
// example failure response: throw new HttpException(error.message || 'Failed to mint token', HttpStatus.BAD_REQUEST, error);

// write all endpoints to do same job as the below module script:

// const identityImplementation = m.contract("Identity", OnchainID.contracts.Identity, [deployer.address, true]);
// const identityImplementationAuthority = m.contract("ImplementationAuthority", OnchainID.contracts.ImplementationAuthority, [identityImplementation]);
// tokenOID = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, tokenIssuer.address], { id: "tokenOID" });
// ClaimIssuerOID = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, claimIssuer.address], { id: "ClaimIssuerOID" });
// console.log("key for ClaimIssuerOID: ", ethers.keccak256((ethers.AbiCoder.defaultAbiCoder()).encode(['address'], [claimIssuer.address])), 3, 1)
// aliceIdentity = m.contract("IdentityProxy", OnchainID.contracts.IdentityProxy, [identityImplementationAuthority, aliceWallet.address], { id: "aliceIdentity" });
// m.call(IdentityRegistry, "init", [TrustedIssuersRegistry, ClaimTopicsRegistry, IdentityRegistryStorage]);
// m.call(Token, "init", [IdentityRegistry, ModularCompliance, "ltcBond", "ltcToken", 0, tokenIssuer.address]);
// m.call(ClaimTopicsRegistry, "addClaimTopic", [7]);
// m.call(IdentityRegistry, "transferOwnership", [tokenIssuer.address], { id: "ownershipTransferTokenAgent" }) // For Claim Issuer Identity Contract
// m.call(IdentityRegistry, "addAgent", [tokenAgent.address]); //tokenAgent manages the claim topics registry
// m.call(TrustedIssuersRegistry, "addTrustedIssuer", [tokenIssuer.address, [7]])
// m.call(IdentityRegistryStorage, "init", []) //,{from: tokenAdmin.address}
// m.call(IdentityRegistryStorage, "addAgent", [tokenAdmin.address]); //, { from: tokenAdmin.address} //tokenAgent manages the claim topics registry
// m.call(Token, "addAgent", [tokenAdmin.address]); //tokenAgent manages the claim topics registry
//     const claimForAlice = {
//     data: ethers.hexlify(ethers.toUtf8Bytes('Some claim public data.')),
//     issuer: claimIssuer,
//     topic: 7,
//     scheme: 1,
//     identity: "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c",
//     signature: '',
// };
// claimForAlice.signature = await claimIssuer.signMessage(
//     ethers.getBytes(
//     ethers.keccak256(
//         ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'bytes'], [claimForAlice.identity, claimForAlice.topic, claimForAlice.data]),
//     ),
//     ),
// );
// m.call(aliceIdentity, "addClaim", [claimForAlice.topic, claimForAlice.scheme, claimForAlice.issuer, claimForAlice.signature, claimForAlice.data, '']);
// m.call(IdentityRegistryStorage, "addIdentityToStorage", [aliceWallet.address, IdentityRegistry, 20], { id: "registerAliceForChainId", from: tokenAdmin.address })
// m.call(IdentityRegistryStorage, "addIdentityToStorage", [bobWallet.address, IdentityRegistry, 20], { id: "registerBobForChainId", from: tokenAdmin.address })
// m.call(Token, "mint", [aliceWallet.address, 1000], { id: "mintForAlice" });
// m.call(Token, "mint", [bobWallet.address, 1000], { id: "mintForBob" });
    