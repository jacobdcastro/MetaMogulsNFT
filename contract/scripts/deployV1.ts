const hre = require('hardhat');
require('dotenv').config({ path: '.env' });
const contractV1 = require('../artifacts/contracts/MetaMoguls.sol/MetaMoguls.json');

async function mainV1() {
  const constructorV1 = [
    1111, // _maxNFTs1
    250, // _maxAllowListSaleNFTs
    250, // _maxGiftedNFTs
    'https://gateway.pinata.cloud/ipfs/QmZiNkUsEqHEAVHpWd47E1pmSuV4WoBS73hd3S2r5QYwZn', // _baseURI
    true, // _isPublicSaleActive
    true, // _isAllowListSaleActive
    false, // _REVEAL
  ];

  const [owner, hh1, hh2] = await hre.ethers.getSigners();

  const MetaMogulsV1 = await hre.ethers.getContractFactory('MetaMoguls');
  const metaMogulsV1 = await MetaMogulsV1.deploy(...constructorV1);
  await metaMogulsV1.deployed();
  console.log('v1 deployed to:', metaMogulsV1.address);

  const ownerContract = new hre.ethers.Contract(
    metaMogulsV1.address,
    contractV1.abi,
    owner
  );
  const hh1Contract = new hre.ethers.Contract(
    metaMogulsV1.address,
    contractV1.abi,
    hh1
  );
  const hh2Contract = new hre.ethers.Contract(
    metaMogulsV1.address,
    contractV1.abi,
    hh2
  );

  // mint 4 NFTs to hh1
  const hh1Tx = await hh1Contract.mint(4, {
    value: (60000000000000000 * 4).toString(),
  });
  await hh1Tx.wait();

  // mint 10 NFTs to hh1
  const hh2Tx = await hh2Contract.mint(10, {
    value: (60000000000000000 * 10).toString(),
  });
  await hh2Tx.wait();

  // close public sale
  const ownerTx = await ownerContract.setIsPublicSaleActive(false);
  await ownerTx.wait();
}

// Call the main function and catch if there is any error
mainV1()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
