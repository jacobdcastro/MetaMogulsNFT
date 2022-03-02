const _contractV1 = require('../artifacts/contracts/MetaMoguls.sol/MetaMoguls.json');
const _contractV2 = require('../artifacts/contracts/MetaMogulsV2.sol/MetaMogulsV2.json');

async function main() {
  const constructorV1 = [
    1111, // _maxNFTs1
    250, // _maxAllowListSaleNFTs
    250, // _maxGiftedNFTs
    'https://gateway.pinata.cloud/ipfs/QmZiNkUsEqHEAVHpWd47E1pmSuV4WoBS73hd3S2r5QYwZn', // _baseURI
    true, // _isPublicSaleActive
    true, // _isAllowListSaleActive
    false, // _REVEAL
  ];
  const constructorV2 = [
    1111, // _maxNFTs1
    'https://gateway.pinata.cloud/ipfs/QmZiNkUsEqHEAVHpWd47E1pmSuV4WoBS73hd3S2r5QYwZn', // _baseURI
    true, // _isPublicSaleActive
    true, // _REVEAL
    '0x5fbdb2315678afecb367f032d93f642f64180aa3', // _oldContract
    14, // _currentSupply
  ];

  const [owner, hh1, hh2] = await hre.ethers.getSigners();

  const MetaMogulsV1 = await hre.ethers.getContractFactory('MetaMoguls');
  const metaMogulsV1 = await MetaMogulsV1.deploy(...constructorV1);
  await metaMogulsV1.deployed();
  console.log('v1 deployed to:', metaMogulsV1.address);

  const ownerContractV1 = new hre.ethers.Contract(
    metaMogulsV1.address,
    _contractV1.abi,
    owner
  );
  const hh1ContractV1 = new hre.ethers.Contract(
    metaMogulsV1.address,
    _contractV1.abi,
    hh1
  );
  const hh2ContractV1 = new hre.ethers.Contract(
    metaMogulsV1.address,
    _contractV1.abi,
    hh2
  );

  // mint 4 NFTs to hh1
  const hh1Tx = await hh1ContractV1.mint(4, {
    value: (60000000000000000 * 4).toString(),
  });
  await hh1Tx.wait();

  // mint 10 NFTs to hh1
  const hh2Tx = await hh2ContractV1.mint(10, {
    value: (60000000000000000 * 10).toString(),
  });
  await hh2Tx.wait();

  // close public sale
  const ownerTx = await ownerContractV1.setIsPublicSaleActive(false);
  await ownerTx.wait();

  // deploy v2
  const MetaMogulsV2 = await hre.ethers.getContractFactory('MetaMogulsV2');
  const metaMogulsV2 = await MetaMogulsV2.deploy(...constructorV2);
  await metaMogulsV2.deployed();
  console.log('v2 deployed to:', metaMogulsV2.address);

  const ownerContractV2 = new hre.ethers.Contract(
    metaMogulsV2.address,
    _contractV2.abi,
    owner
  );
  const hh1ContractV2 = new hre.ethers.Contract(
    metaMogulsV2.address,
    _contractV2.abi,
    hh1
  );
  const hh2ContractV2 = new hre.ethers.Contract(
    metaMogulsV2.address,
    _contractV2.abi,
    hh2
  );

  const tokenIdsToMigrate = [1, 2, 3, 4];

  // for (let i = 0; i < 4; i++) {
  const checkBalanceOf = async (account: 'hh1' | 'hh2') => {
    const address = account === 'hh1' ? hh1.address : hh2.address;
    const a = await ownerContractV1.balanceOf(address);
    const b = await ownerContractV2.balanceOf(address);

    console.log(`balance of ${account}`);
    console.log('v1:', a);
    console.log('v2:', b);
  };

  await checkBalanceOf('hh1');

  const approveTxV1 = await hh1ContractV1.setApprovalForAll(
    metaMogulsV2.address,
    true
  );
  await approveTxV1.wait();
  // const approveTxV2 = await hh1ContractV2.approve(
  //   hh1.address,
  //   tokenIdToMigrate
  // );
  // await approveTxV2.wait();

  const migrateTx = await hh1ContractV2.claimAll(tokenIdsToMigrate);
  await migrateTx.wait();

  console.log({ migrateTx });

  await checkBalanceOf('hh1');
  // }
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
