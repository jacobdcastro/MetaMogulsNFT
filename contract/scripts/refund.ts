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
    .map((tx1, i, arr) => {
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
  const [owner] = await hre.ethers.getSigners();
  const fullData = getAllTxnsByAddress();

  // may have skipped #17, #77, #158, #219
  const numberToStartFrom = 219;

  const data = fullData.slice(numberToStartFrom);

  // console.log('original list length:  ', fullData.length);
  // console.log('new list length:       ', data.length);

  console.log('');
  console.log('');
  console.log('');
  console.log('');

  // txn to send ETH
  const sendOwedEth = async (
    { amountToRefundEth, address }: any,
    _index: number
  ) => {
    const amountEth = roundNumberTo(amountToRefundEth, 9);
    console.log(
      `|| ================= TX #${
        _index + 1 + numberToStartFrom
      } =================`
    );
    console.log(`|| Sending ${amountEth} ETH to ${address}...`);
    const sendRefundTx = await owner.sendTransaction({
      to: address,
      value: hre.ethers.utils.parseEther(amountEth.toString()),
    });

    await sendRefundTx.wait();
    totalEthSent += amountEth;
    console.log(`|| Txn Complete!`);
    console.log('||');
    console.log(`|| Sent from:   ${owner.address}`);
    console.log(`|| Sent to:     ${address}`);
    console.log(`|| Amount Sent: ${amountEth} ETH`);
    console.log(`|| Etherscan:   https://etherscan.io/tx/${sendRefundTx.hash}`);
    console.log('||');
    console.log('|| TOTAL SENT SO FAR:', totalEthSent, 'ETH');
    console.log(`|| ===========================================`);
    console.log('');
    console.log('');
  };

  // maps array of promise fns to execute in for loop
  const allExecutableTxns = data.map((item, index) => async () => {
    await sendOwedEth(item, index);
  });

  // execute series of async sendOwedEth fns
  for (const fn of allExecutableTxns) {
    await fn();
  }

  console.log(
    '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'
  );
  console.log('        ALL TRANSACTIONS COMPLETE!!!          ');
  console.log(
    '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'
  );
  console.log('');
  console.log('');
  console.log('|| =================== STATS ====================');
  console.log('||');
  console.log('|| Wallets Refunded:', data.length);
  console.log('|| Total ETH Sent:', totalEthSent, 'ETH');
  console.log('|| Etherscan:', `https://etherscan.io/address/${owner.address}`);
  console.log('||');
  console.log('|| ==============================================');
  console.log('');
  console.log('');
}

// Call the main function and catch if there is any error
refund()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
