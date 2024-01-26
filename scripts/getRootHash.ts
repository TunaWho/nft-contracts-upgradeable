// https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9
//
// 1. Import libraries. Use `npm` package manager to install
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

async function main() {
    // 2. Collect list of wallet addresses from competition, raffle, etc.
    // Store list of addresses in some data sheeet (Google Sheets or Excel)
    let whitelistAddresses = [
      "0x14497EF23D93F573A838f25722c1A822B6E610cD",
      "0x1bc7111F3733e9A7B43Ba37E4FB34BBa1c992e2f",
      "0xC6Af57a80C7769DC530ff6590f79F94EE57E2417",
      "0x892d82Bb78D2C8f1142b8fD9D13BBC2213b31695",
      "0x499eF89d7fc918122e00067D299244dC70361bED",
      "0x610905B37820Df2540eA5cC054eb35638622459c",
    ];

    // 3. Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
    // using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
    //
    // The leaves, merkleTree, and rootHas are all PRE-DETERMINED prior to whitelist claim
    const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});

    // 4. Get root hash of the `merkleeTree` in hexadecimal format (0x)
    // Print out the Entire Merkle Tree.
    const rootHash = merkleTree.getRoot();
    console.log('Whitelist Merkle Tree\n', merkleTree.toString());
    console.log("Root Hash: ", '0x' + rootHash.toString('hex'));

    // ***** ***** ***** ***** ***** ***** ***** ***** // 

    // CLIENT-SIDE: Use `msg.sender` address to query and API that returns the merkle proof
    // required to derive the root hash of the Merkle Tree

    // ✅ Positive verification of address
    const claimingAddress = leafNodes[4];
    // ❌ Change this address to get a `false` verification
    // const claimingAddress = keccak256("0X5B38DA6A701C568545DCFCB03FCB875F56BEDDD6");

    // `getHexProof` returns the neighbour leaf and all parent nodes hashes that will
    // be required to derive the Merkle Trees root hash.
    const hexProof = merkleTree.getHexProof(claimingAddress);
    console.log(hexProof);

    // ✅ - ❌: Verify is claiming address is in the merkle tree or not.
    // This would be implemented in your Solidity Smart Contract
    // console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
[
  "0xe915a10e98df69e678e8614ce38b3780d5a0dee800c0f7a40e2711c771dabae8",
  "0xa4c2a2584d143c2f81621e962b22bd1ac6728828ce2360830cdb846b2072c323",
  "0x0bcc681e6cfff4163189f61f723e14525e792d8a91cb867f3d089c1cd337ce8d"
]