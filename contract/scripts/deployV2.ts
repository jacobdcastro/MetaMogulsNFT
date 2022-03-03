require('dotenv').config({ path: '.env' });
const contractV2 = require('../artifacts/contracts/MetaMogulsV2.sol/MetaMogulsV2.json');

async function mainV2() {
  const constructorV2 = [
    1111, // _maxNFTs1
    'https://gateway.pinata.cloud/ipfs/QmZiNkUsEqHEAVHpWd47E1pmSuV4WoBS73hd3S2r5QYwZn', // _baseURI
    true, // _isPublicSaleActive
    true, // _REVEAL
    '0x5d6685C7BD265204ec9BDE279095CBF478165898', // _oldContract
    872, // _currentSupply
    60, // _initialReserveCount
  ];

  const MetaMogulsV2 = await hre.ethers.getContractFactory('MetaMogulsV2');
  const metaMogulsV2 = await MetaMogulsV2.deploy(...constructorV2);
  await metaMogulsV2.deployed();
  console.log('v2 deployed to:', metaMogulsV2.address);

  // const ownerContract = new hre.ethers.Contract(
  //   metaMogulsV2.address,
  //   contractV2.abi,
  //   owner
  // );

  // const tx = await ownerContract.balanceOf(owner.address);
  // const _tx = await ownerContract.getReserveTokenIdsMinted();
  // console.log(tx, _tx);
  // const hh1Contract = new hre.ethers.Contract(
  //   metaMogulsV2.address,
  //   contractV2.abi,
  //   hh1
  // );
  // const hh2Contract = new hre.ethers.Contract(
  //   metaMogulsV2.address,
  //   contractV2.abi,
  //   hh2
  // );
}

// Call the main function and catch if there is any error
mainV2()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// export default mainV2;
