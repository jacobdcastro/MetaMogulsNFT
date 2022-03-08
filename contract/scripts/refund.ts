import fs from 'fs';
require('dotenv').config({ path: '.env' });

const cutoffTimestamp = 1646280059; // March 2nd 2022, 11pm EST

const roundNumberTo = (num: number, decimalPlaces: number) =>
  Number(
    Math.round(parseFloat(num.toString() + 'e' + decimalPlaces.toString())) +
      'e-' +
      decimalPlaces
  );

const getAllTxnsByAddress = () => {
  const data = fs
    .readFileSync('./txns.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim().slice(1, -1))) // split each line to array
    .filter(e => e[15] === 'Claim All' || e[15] === 'Set Approval For All'); // filter for only claimAll and setApprovalForAll methods

  const formattedData = data
    .map(tx => ({
      // restructure dataset
      txHash: tx[0],
      timestamp: tx[2],
      dateTime: tx[3],
      fromAddress: tx[4],
      txFeeEth: parseFloat(tx[10]),
      txFeeUsd: Math.round(parseFloat(tx[11]) * 100) / 100,
      method: tx[15],
    }))
    // associate 1 address with all of it's txns
    .map((tx1, index, arr) => {
      const address = tx1.fromAddress;
      const allTxnsOfAddress = arr.filter(tx => tx.fromAddress === address);
      return { address, txns: allTxnsOfAddress };
    })
    // remove duplicate address listings
    .filter(
      (tx, ind, arr) => ind === arr.findIndex(t => t.address === tx.address)
    )
    // remove addresses who didn't fully migrate
    .filter(tx => tx.txns.map(t => t.method).includes('Claim All'))
    // add fields for total refund, latestDateTime
    .map(({ txns, address }) => {
      const totalGasSpentEth = txns
        .map(i => i.txFeeEth)
        .reduce((prev, next) => prev + next, 0);

      const totalGasSpentUsd =
        Math.round(
          txns.map(i => i.txFeeUsd).reduce((prev, next) => prev + next, 0) * 100
        ) / 100;

      const latestTxnDate = txns
        .map(i => i.timestamp)
        .sort()
        .slice(-1)[0];

      let amountToRefundEth = totalGasSpentEth;
      let amountToRefundUsd = totalGasSpentUsd;
      let afterCutoff = false;

      // after cutoff time gets max of $20 refund in ETH
      if (parseInt(latestTxnDate) > cutoffTimestamp) {
        afterCutoff = true;
        if (totalGasSpentUsd > 20) {
          amountToRefundEth = totalGasSpentEth / (totalGasSpentUsd / 20);
          amountToRefundUsd = totalGasSpentUsd / (totalGasSpentUsd / 20);
        }
      }

      return {
        address,
        totalGasSpentEth,
        totalGasSpentUsd,
        amountToRefundEth,
        amountToRefundUsd,
        latestTxnDate,
        afterCutoff,
        refunded: false,
        txns,
      };
    });

  return formattedData;
};

let totalEthSent = 0;

async function refund() {
  const [hh0] = await hre.ethers.getSigners();
  const data = getAllTxnsByAddress();
  // const provider = hre.ethers.getDefaultProvider('');
  // const wallet = new hre.ethers.Wallet(MASTER_PRIVATE_KEY, provider);

  const sendOwedEth = async (
    { amountToRefundEth, address }: any,
    _index: number
  ) => {
    const amountEth = roundNumberTo(amountToRefundEth, 9);
    const sendRefundTx = await hh0.sendTransaction({
      to: address,
      value: hre.ethers.utils.parseEther(amountEth.toString()),
    });
    await sendRefundTx.wait();
    totalEthSent += amountEth;
    console.log({ _index, ...sendRefundTx });
  };

  const allExecutableTxns = data.map((item, index) => async () => {
    await sendOwedEth(item, index);
  });

  for (const fn of allExecutableTxns) {
    await fn();
  }

  console.log(data.length, { totalEthSent });
}

// Call the main function and catch if there is any error
refund()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
