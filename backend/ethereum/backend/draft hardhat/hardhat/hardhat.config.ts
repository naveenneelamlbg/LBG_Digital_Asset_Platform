import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  // networks: {
  //   hardhat: {
  //     allowUnlimitedContractSize: true,
  //   },
  // },
  // solidity: {
  //   compilers: [
  //     {
  //       version: "0.8.20",
  //     },
  //   ],
  // },
};

export default config;
