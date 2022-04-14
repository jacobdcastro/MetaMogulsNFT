const axios = require('axios');

async function main() {
  const baseUri =
    'https://ipfs.io/ipfs/QmZiNkUsEqHEAVHpWd47E1pmSuV4WoBS73hd3S2r5QYwZn/';
  const correctImageCID =
    'bafybeia4pftldy5x7pjmvd7frqaguv2464t4adyesgiltbmqffln4336wu/';

  let allTokenIds = [];

  for (let i = 1; i <= 1111; i++) {
    allTokenIds.push(i);
  }

  const getTokenImageCID = async (tokenId: number) => {
    const tokenUri = baseUri + tokenId.toString() + '.json';

    const {
      data: { image },
    } = await axios.get(tokenUri);

    const imageCID = image.slice(
      7,
      image.length - (tokenId.toString().length + 4)
    );

    if (imageCID !== correctImageCID) {
      console.log('');
      console.log('');
      console.log('');
      console.log('#' + tokenId + ':');
      console.log(imageCID);
      console.log(correctImageCID);
    }
  };

  const allFetchFns = allTokenIds.map(item => async () => {
    await getTokenImageCID(item);
  });

  for (const fn of allFetchFns) {
    await fn();
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
