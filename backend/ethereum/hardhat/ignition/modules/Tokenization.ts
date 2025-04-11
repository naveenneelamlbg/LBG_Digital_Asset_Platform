// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TokenizationModule = buildModule("TokenizationModule", (m) => {
  const Token = m.contract("Token");
  const ClaimTopicsRegistry = m.contract("ClaimTopicsRegistry");
  const IdentityRegistry = m.contract("IdentityRegistry");
  const IdentityRegistryStorage = m.contract("IdentityRegistryStorage");
  const TrustedIssuersRegistry = m.contract("TrustedIssuersRegistry");
  const ModularCompliance = m.contract("ModularCompliance");
  // const ClaimIssuerRegistry = m.contract("ClaimIssuerRegistry");

  return {
    Token,
    ClaimTopicsRegistry,
    IdentityRegistry,
    IdentityRegistryStorage,
    // ClaimIssuerRegistry,
    TrustedIssuersRegistry,
    ModularCompliance,
  };
});

export default TokenizationModule;
