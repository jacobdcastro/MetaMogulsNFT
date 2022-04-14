require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '.env' });

const ALCHEMY_MAINNET_URL = process.env.ALCHEMY_MAINNET_API_KEY_URL;
const ALCHEMY_RINKEBY_URL = process.env.ALCHEMY_RINKEBY_API_KEY_URL;
const DEV_PRIVATE_KEY = process.env.RINKEBY_DEV_PRIVATE_KEY;
const OWNER_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY;

module.exports = {
  solidity: '0.8.4',
  // networks: {
  //   rinkeby: {
  //     url: ALCHEMY_RINKEBY_URL,
  //     accounts: [DEV_PRIVATE_KEY],
  //   },
  //   mainnet: {
  //     url: ALCHEMY_MAINNET_URL,
  //     accounts: [OWNER_PRIVATE_KEY],
  //   },
  // },
};
