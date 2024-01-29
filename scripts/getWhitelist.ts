import axios from 'axios';
import * as fs from 'fs';

const apiUrl = 'https://zetachain-athens-3.blockscout.com/api';
const action = 'getTokenHolders';
const contractAddress = '0x1D10497144b9F0a7AEECE416ACB64349a0A1c67A';
const page1 = 1;
const page2 = 2;
const offset = 10000;

async function fetchData(page: number): Promise<string[]> {
  try {
    const response = await axios.get(apiUrl, {
      params: {
        module: 'token',
        action,
        contractaddress: contractAddress,
        page,
        offset,
      },
    });

    return response.data.result.map((holder: any) => holder.address);
  } catch (error) {
    console.error(`Error fetching data for page ${page}:`, error.message);
    return [];
  }
}

async function main() {
  try {
    const [addressesPage1, addressesPage2] = await Promise.all([
      fetchData(page1),
      fetchData(page2),
    ]);

    const allAddresses = [...addressesPage1, ...addressesPage2];

    // Export to JSON file
    const jsonOutput = JSON.stringify(allAddresses, null, 2);
    fs.writeFileSync('scripts/addresses.json', jsonOutput);

    console.log('Addresses exported to addresses.json');
  } catch (error) {
    console.error('Error in main:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

