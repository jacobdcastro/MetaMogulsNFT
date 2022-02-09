import { providers, Contract, utils, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import abi from '../config/abi.json';
import CONFIG from '../config/config.json';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0x5d6685C7BD265204ec9BDE279095CBF478165898';

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const { provider, address } = useWeb3();

  const getContract = () => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS, abi, signer);
  };

  const mintPresale = async (mintAmount: number) => {
    const contract = getContract();
    let cost = CONFIG.PRESALE_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = cost * mintAmount;
    let totalGasLimit = gasLimit * mintAmount;
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);

    try {
      const tx = await contract.mint(mintAmount, {
        value: totalCostWei.toString(),
      });

      setLoading(true);
      await tx.wait();
      console.log(tx);
      setLoading(false);
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
