import { providers, utils, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import abi from '../config/abi.json';
import CONFIG from '../config/config.json';
import { useState } from 'react';
import Web3EthContract from 'web3-eth-contract';

const CONTRACT_ADDRESS = '0x5d6685C7BD265204ec9BDE279095CBF478165898';

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const { provider, address } = useWeb3();

  const getContract = () => {
    // const signer = provider?.getSigner();
    // @ts-ignore
    Web3EthContract.setProvider(provider);
    // @ts-ignore
    return new Web3EthContract(abi, CONTRACT_ADDRESS);
  };

  const mintPresale = async (mintAmount = 1) => {
    const contract = getContract();
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = cost * mintAmount;
    let totalGasLimit = gasLimit * mintAmount;
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);
    setLoading(true);

    console.log({ mintAmount, totalGasLimit, CONTRACT_ADDRESS });

    try {
      contract.methods
        .mint(mintAmount)
        .send({
          gasLimit: totalGasLimit,
          to: CONTRACT_ADDRESS,
          from: address,
          value: totalCostWei,
        })
        .once('error', err => {
          console.log(err);
          setLoading(false);
        })
        .then(receipt => {
          console.log(receipt);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  // @ts-ignore
  // const web3Provider = new providers.Web3Provider(provider);

  // const getNetwork = async () => {
  //   const { chainId } = await web3Provider.getNetwork();
  //   console.log(chainId);
  // };

  return { mintPresale };
};
