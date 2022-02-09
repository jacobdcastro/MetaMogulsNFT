import { providers, Contract, utils, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import abi from '../config/abi.json';
import CONFIG from '../config/config.json';
import { useCallback, useMemo, useState } from 'react';

const CONTRACT_ADDRESS = '0x5d6685C7BD265204ec9BDE279095CBF478165898';

// rinkeby
// const CONTRACT_ADDRESS = '0x3eae6f1c9a1f1d1Eecd7a30aaaEE457252146c96';

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const { provider, address } = useWeb3();

  const getContract = useCallback(() => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS, abi, signer);
  }, [provider]);

  const getPublicSaleStatus = useCallback(async () => {
    const contract = getContract();
    return await contract.isPublicSaleActive();
  }, [getContract]);

  const getTokenCount = useCallback(async () => {
    const contract = getContract();
    return await contract.getLastTokenId();
  }, [getContract]);

  const mintNft = async (mintAmount: number) => {
    const contract = getContract();
    let cost = CONFIG.WEI_COST;
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
      setSuccess(true);
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return {
    mintNft,
    loading,
    getPublicSaleStatus,
    getTokenCount,
    error,
    success,
  };
};
