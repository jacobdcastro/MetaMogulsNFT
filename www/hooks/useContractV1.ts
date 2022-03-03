import { Contract, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import abi from '../config/abi.json';
import CONFIG from '../config/config.json';
import { useCallback, useMemo, useState } from 'react';

// mainnet
const CONTRACT_ADDRESS_V1 = '0x5d6685C7BD265204ec9BDE279095CBF478165898';

// rinkeby
// const CONTRACT_ADDRESS_V1 = '0x9aA645bd65acE566C6414d15291D16a3753A4c9E';

// localhost
// const CONTRACT_ADDRESS_V1 = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export const useContractV1 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState(false);
  const { provider, address } = useWeb3();

  const getContractV1 = useCallback(() => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS_V1, abi, signer);
  }, [provider]);

  const getPublicSaleStatus = useCallback(async () => {
    const contractV1 = getContractV1();

    const status = await contractV1.isPublicSaleActive();
    console.log(status);
    return status;
  }, [getContractV1]);

  const getAllowListSaleStatus = useCallback(async () => {
    const contractV1 = getContractV1();
    const status = await contractV1.isAllowListSaleActive();
    console.log(status);
    return status;
  }, [getContractV1]);

  const getTotalTokenCount = useCallback(async () => {
    const contractV1 = getContractV1();
    return await contractV1.getLastTokenId();
  }, [getContractV1]);

  const getTokenBalanceOfAddressV1 = useCallback(
    async (addr: string) => {
      const contractV1 = getContractV1();
      const balance = await contractV1.balanceOf(addr);
      return balance.toNumber();
    },
    [getContractV1]
  );

  const getAllTokensOfAddressV1 = useCallback(
    async (addr: string) => {
      const contractV1 = getContractV1();
      let supply = await contractV1.getLastTokenId();
      let allTokenIds = [];
      let ownedTokenIds: number[] = [];

      for (let i = 1; i <= supply; i++) {
        allTokenIds.push(i);
      }

      const isOwnerOfId = async (id: number) => {
        let owner = await contractV1.ownerOf(id.toString());
        if (owner === addr) {
          ownedTokenIds.push(id);
        }
      };

      await Promise.all(allTokenIds.map(tokenId => isOwnerOfId(tokenId)));

      return ownedTokenIds;
    },
    [getContractV1]
  );

  const mintNft = async (mintAmount: number) => {
    const contractV1 = getContractV1();
    let cost = CONFIG.PUBLIC_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = cost * mintAmount;
    let totalGasLimit = gasLimit * mintAmount;
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);

    try {
      const tx = await contractV1.mint(mintAmount, {
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

  const closeSale = async () => {
    const contractV1 = getContractV1();

    try {
      setCloseLoading(true);
      const tx1 = await contractV1.setIsPublicSaleActive(false);
      await tx1.wait();
      const tx2 = await contractV1.setIsAllowListSaleActive(false);
      await tx2.wait();
      setCloseLoading(false);
      setCloseSuccess(true);
    } catch (error) {
      setCloseLoading(false);
      setCloseError(true);
      console.error(error);
    }
  };

  return {
    mintNft,
    loading,
    getPublicSaleStatus,
    getAllowListSaleStatus,
    getTotalTokenCount,
    getAllTokensOfAddressV1,
    closeSale,
    error,
    success,
    closeLoading,
    closeError,
    closeSuccess,
  };
};
