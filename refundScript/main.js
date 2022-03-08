const fs = require('fs');
const { ethers } = require('ethers');

const cutoffTimestamp = 1646280059; // March 2nd 2022, 11pm EST

const getAllTxnsByAddress = () => {
  const data = fs
    .readFileSync('./txns.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim().slice(1, -1))) // split each line to array
    .filter(e => e[15] === 'Claim All' || e[15] === 'Set Approval For All'); // filter for only claimAll and setApprovalForAll methods

  return (
    data
      .map(tx => ({
        // restructure dataset
        txHash: tx[0],
        timestamp: tx[2],
        dateTime: tx[3],
        fromAddress: tx[4],
        txFeeEth: parseFloat(tx[10]),
        txFeeUsd: Math.round((parseFloat(tx[11]) + Number.EPSILON) * 100) / 100,
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
      .map(item => {
        const totalRefundEth = item.txns
          .map(i => i.txFeeEth)
          .reduce((prev, next) => prev + next, 0);

        const totalRefundUsd =
          Math.round(
            (parseFloat(
              item.txns
                .map(i => i.txFeeUsd)
                .reduce((prev, next) => prev + next, 0)
            ) +
              Number.EPSILON) *
              100
          ) / 100;

        const latestTxnDate = item.txns
          .map(i => i.timestamp)
          .sort()
          .slice(-1)[0];

        return {
          ...item,
          totalRefundEth,
          totalRefundUsd,
          latestTxnDate,
          refunded: false,
        };
      })
  );
};

const allTxns = getAllTxnsByAddress();

console.log(allTxns);
