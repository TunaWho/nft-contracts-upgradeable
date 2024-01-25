import hre from "hardhat";
import { ethers, upgrades } from "hardhat";
import { promisify } from "util";

// load wallet private key from env file
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const wallet = new ethers.Wallet(PRIVATE_KEY);

const sleep = promisify(setTimeout);
const args = [
  'Abstra NFT',
  'ABS',
  wallet.address,
  5000,
  '0xc39f1448f9cee1b7f20499b8e0e64b573caaf0ef19e18516e522ff2d9f016d80'
];

async function deployAndVerify(contractName: string, constructorArguments?: Array<string | number>) {
  const factory = await ethers.getContractFactory(contractName);
  console.log('Deploying', contractName, '...');

  const contract = await upgrades.deployProxy(
    factory,
    constructorArguments,
    {
      initializer: 'initialize',
    }
  );

  await contract.waitForDeployment();
  console.log(contractName, ' deployed to:', contract.target);
  const impAdress = await upgrades.erc1967.getImplementationAddress(
    await contract.getAddress()
  );

  if (hre.network.name !== 'hardhat') {
    const { sourceName } = await hre.artifacts.readArtifact(contractName);
    const maxErrors = 5;
    const errors = [];

    /* eslint-disable no-await-in-loop */
    while (errors.length < maxErrors) {
      try {
        await hre.run('verify:verify', {
          address: impAdress,
          constructorArguments,
          contract: `${sourceName}:${contractName}`,
        });
        break;
      } catch (e: any) {
        if (e.message.includes('Contract source code already verified')) {
          break;
        } else {
          errors.push(e);
        }
      }
      console.log('contract not yet deployed. waiting...');
      await sleep(8000);
    }
    /* eslint-enable no-await-in-loop */

    if (errors.length === maxErrors) {
      throw errors[maxErrors - 1];
    }
  }

  return contract.address;
}

async function main() {
  await deployAndVerify('AbstraNFT', args);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
