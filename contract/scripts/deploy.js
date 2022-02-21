const { ethers } = require('hardhat');
require('dotenv').config({ path: '.env' });
const { WHITELIST_CONTRACT_ADDRESS, METADATA_URL } = require('../constants');

async function main() {
  const mmv1 = await ethers.get;
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
