import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";

import dotenv from "dotenv";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-toolbox";
import { getHardhatConfigNetworks } from "@zetachain/networks";
import "@zetachain/toolkit/tasks";

dotenv.config();

const chainIds = {
  hardhat: 31337,
  mainnet: 1,
  goerli: 5,
  base_mainnet: 8453,
  base_goerli: 84531,
  opbnb_mainnet: 204,
  scrollSepolia: 534351,
  taiko_testnet: 167007,
  mode: 34443,
  manta: 169,
  scroll_mainnet: 534352,
  zk_fair: 42766,
  x1: 195,
  bsc_testnet: 97,
  mumbai_testnet: 80001
};

const settings = {
  optimizer: {
    enabled: true,
    runs: 200,
  },
};

// Ensure that we have all the environment variables we need.
const accountPrivateKey: string = process.env.PRIVATE_KEY || "";

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {
  let nodeUrl = ''

  switch (network) {
    case "base_mainnet":
      nodeUrl = 'https://developer-access-mainnet.base.org';
      break;
    case "base_goerli":
      nodeUrl = 'https://goerli.base.org';
      break;
    case "goerli":
      nodeUrl = 'https://rpc.ankr.com/eth_goerli';
      break;
    case "opbnb_mainnet":
      nodeUrl = 'https://opbnb-mainnet-rpc.bnbchain.org';
      break;
    case "manta":
      nodeUrl = 'https://pacific-rpc.manta.network/http';
      break;
    case "taiko_testnet":
      nodeUrl = 'https://rpc.jolnir.taiko.xyz';
      break;
    case "mode":
      nodeUrl = 'https://mainnet.mode.network/';
      break;
    case "scrollSepolia":
      nodeUrl = 'https://sepolia-rpc.scroll.io';
      break;
    case "scroll_mainnet":
      nodeUrl = 'https://rpc.scroll.io';
      break;
    case "zk_fair":
      nodeUrl = 'https://rpc.zkfair.io';
      break;
    case "bsc_testnet":
      nodeUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
      break;
    case "mumbai_testnet":
      nodeUrl = 'https://rpc.ankr.com/polygon_mumbai';
      break;
    case "x1":
      nodeUrl = 'https://testrpc.x1.tech';
      break;
  }

  return {
    chainId: chainIds[network],
    url: nodeUrl,
    accounts: [`${accountPrivateKey}`],
    gasPrice: 5000000000,
    // gasPrice: 10000000000000,
    // gasPrice: 0,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: '0.6.6', settings },
      { version: '0.6.0', settings },
      { version: '0.5.16', settings },
      { version: '0.8.19', settings },
      { version: '0.8.20', settings },
      { version: '0.8.18', settings }
    ],
    settings: {
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts/flattened",
    tests: "./test",
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  gasReporter: {
    coinmarketcap: process.env.REPORT_GAS_COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
  },
  abiExporter: {
    path: './abi',
    // pretty: true,
    clear: false,
  },
  mocha: {
    timeout: 20000
  },
  etherscan: {
    apiKey: {
      "zeta_testnet": "abc",
    },
    customChains: [
      {
        network: "zeta_testnet",
        chainId: 7001,
        urls: {
          apiURL: "https://zetachain-athens-3.blockscout.com/api",
          browserURL: "https://zetachain-athens-3.blockscout.com/"
        }
      },
    ]
  },
};

if (accountPrivateKey) {
  config.networks = {
    ...getHardhatConfigNetworks(),
    mainnet: createTestnetConfig("mainnet"),
    goerli: createTestnetConfig("goerli"),
    base_goerli: createTestnetConfig("base_goerli"),
    base_mainnet: createTestnetConfig("base_mainnet"),
    taiko_testnet: createTestnetConfig("taiko_testnet"),
    manta: createTestnetConfig("manta"),
    mode: createTestnetConfig("mode"),
    opbnb_mainnet: createTestnetConfig("opbnb_mainnet"),
    scrollSepolia: createTestnetConfig("scrollSepolia"),
    scroll_mainnet: createTestnetConfig("scroll_mainnet"),
    zk_fair: createTestnetConfig("zk_fair"),
    x1: createTestnetConfig("x1"),
    mumbai_testnet: createTestnetConfig("mumbai_testnet"),
    bsc_testnet: createTestnetConfig("bsc_testnet"),
  };
}

config.networks = {
  ...config.networks,
  hardhat: {
    chainId: 1337,
  },
};

export default config;
