const axios = require('axios');
const cheerio = require('cheerio');
const { ethers } = require('ethers');

const urls = [
  'https://etherscan.io/txs?a=0x490241c095c83720133efb32358c1a8059c9daab&ps=100&p=1',
  'https://etherscan.io/txs?a=0x490241c095c83720133efb32358c1a8059c9daab&ps=100&p=2',
  'https://etherscan.io/txs?a=0x490241c095c83720133efb32358c1a8059c9daab&ps=100&p=3',
  'https://etherscan.io/txs?a=0x490241c095c83720133efb32358c1a8059c9daab&ps=100&p=4',
  'https://etherscan.io/txs?a=0x490241c095c83720133efb32358c1a8059c9daab&ps=100&p=5',
];

const allEligibleTxns = []; // every single txn
const walletFeeOwed = []; // filtered list of combined tx fee per wallet

const scrapePage = async url => {
  const { data: html } = await axios(url);
  const $ = cheerio.load(html);

  for (let row = 0; row < 100; row++) {
    const method = $(
      `#paywall_mask > table > tbody > tr:nth-child(${row}) > td:nth-child(3) > span`
    ).text();

    if (method === 'Claim All' || method === 'Set Approval For...') {
      let addressFrom;

      const fullAddress = $(
        `#paywall_mask > table > tbody > tr:nth-child(${row}) > td:nth-child(7) > span > a`
      ).text();
      addressFrom = fullAddress;

      if (addressFrom === '') {
        const addressByEns = $(
          `#paywall_mask > table > tbody > tr:nth-child(${row}) > td:nth-child(7) > a`
        )[0]
          .attribs.href.toString()
          .slice(9);

        addressFrom = addressByEns;
      }

      const gasFee = $(
        `#paywall_mask > table > tbody > tr:nth-child(${row}) > td.showTxnFee > span`
      ).text();

      allEligibleTxns.push({ addressFrom, gasFee });
    }
  }

  // TODO get all duplicated txns by wallet, add tx fee, push to walletFeeOwed[]
  // allEligibleTxns.forEach((item, ind) => console.log({ ...item, ind }));
};

// scrapePage(urls[0]);
Promise.all([
  scrapePage(urls[0]),
  scrapePage(urls[1]),
  scrapePage(urls[2]),
  scrapePage(urls[3]),
  scrapePage(urls[4]),
]).then(() => {
  allEligibleTxns.forEach((tx, index, arr) => {
    const address = tx.addressFrom;
    const tx2 = arr.find(
      (_tx, _index) => _tx.addressFrom === address && _index !== index
    );
    if (tx2) {
      const refund1 = ethers.utils.parseUnits(tx.gasFee).toNumber();
      const refund2 = ethers.utils.parseUnits(tx2.gasFee).toNumber();

      console.log({ gas1: tx.gasFee, refund1, gas2: tx2.gasFee, refund2 });

      walletFeeOwed.push({
        address,
        refundAmount: parseInt(tx2.gasFee) + parseInt(tx.gasFee),
      });
    } else {
      walletFeeOwed.push({ address, refundAmount: parseInt(tx.gasFee) });
    }
  });
  // console.log(walletFeeOwed);
});
