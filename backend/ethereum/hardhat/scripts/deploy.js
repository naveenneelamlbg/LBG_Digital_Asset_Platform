
async function main() {
    const TokenContract = await ethers.getContractFactory("Token");
    const ClaimTopicsRegistryContract = await ethers.getContractFactory("ClaimTopicsRegistry");
    const IdentityRegistryContract = await ethers.getContractFactory("IdentityRegistry");
    const IdentityRegistryStorageContract = await ethers.getContractFactory("IdentityRegistryStorage");
    const ClaimIssuerRegistryContract = await ethers.getContractFactory("ClaimIssuerRegistry");
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

