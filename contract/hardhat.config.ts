require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });

const ALCHEMY_MAINNET_KEY = process.env.ALCHEMY_API_KEY_URL;
const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: ALCHEMY_MAINNET_KEY,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: ALCHEMY_MAINNET_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
};
