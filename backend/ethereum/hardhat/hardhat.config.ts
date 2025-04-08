import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // solidity: "0.8.17",
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: "0.8.20",
      },
      {
        version: "0.8.22",
      },
    ],
  },
};

export default config;
