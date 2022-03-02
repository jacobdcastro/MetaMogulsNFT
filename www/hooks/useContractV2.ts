import { Contract, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import _abi from '../config/abi.json';
import abi from '../config/abi2.json';
import CONFIG from '../config/config.json';
import { useCallback, useMemo, useState } from 'react';

// mainnet
// const CONTRACT_ADDRESS_V1 = '0x5d6685C7BD265204ec9BDE279095CBF478165898';
// const CONTRACT_ADDRESS_V2 = '...';

// rinkeby
const CONTRACT_ADDRESS_V1 = '0x4f7078484812d62e0c256fAdC0748189E501cd29';
const CONTRACT_ADDRESS_V2 = '0xA62d85dCFD6dfB3E0fdbdC3355088b91008413a2';

// localhost
// const CONTRACT_ADDRESS_V1 = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// const CONTRACT_ADDRESS_V2 = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

export const useContractV2 = () => {
  const [mintLoading, setMintLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [migrateSuccess, setMigrateSuccess] = useState(false);
  const [approvalSuccess, setApprovalSuccess] = useState(false);
  const [mintError, setMintError] = useState(false);
  const [migrateError, setMigrateError] = useState(false);
  const [approvalError, setApprovalError] = useState(false);

  const { provider, address } = useWeb3();

  const getContractV1 = useCallback(() => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS_V1, abi.abi, signer);
  }, [provider]);

  const getContractV2 = useCallback(() => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS_V2, abi.abi, signer);
  }, [provider]);

  const getPublicSaleStatus = useCallback(async () => {
    const contractV2 = getContractV2();
    return await contractV2.isPublicSaleActive();
  }, [getContractV2]);

  const getTotalTokenCount = useCallback(async () => {
    const contractV2 = getContractV2();
    return await contractV2.getLastTokenId();
  }, [getContractV2]);

  const getTokenBalanceOfAddressV2 = useCallback(
    async (addr: string) => {
      const contractV2 = getContractV2();
      const balance = await contractV2.balanceOf(addr);
      return balance.toNumber();
    },
    [getContractV2]
  );

  const getIsApprovedForAll = useCallback(async () => {
    const contractV1 = getContractV1();
    const isApprovedForAll = await contractV1.isApprovedForAll(
      address,
      CONTRACT_ADDRESS_V2
    );
    return isApprovedForAll;
  }, [address, getContractV1]);

  const mintNft = async (mintAmount: number) => {
    const contractV2 = getContractV2();
    let cost = CONFIG.PUBLIC_WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = cost * mintAmount;
    let totalGasLimit = gasLimit * mintAmount;
    console.log('Cost: ', totalCostWei);
    console.log('Gas limit: ', totalGasLimit);

    try {
      setMintLoading(true);
      const tx = await contractV2.mint(mintAmount, {
        value: totalCostWei.toString(),
      });
      await tx.wait();
      console.log(tx);
      setMintLoading(false);
      setMintSuccess(true);
    } catch (error) {
      setMintLoading(false);
      setMintError(true);
      console.error(error);
    }
  };

  const approve = async () => {
    const contractV1 = getContractV1();
    try {
      setApprovalLoading(true);
      const tx = await contractV1.setApprovalForAll(CONTRACT_ADDRESS_V2, true);
      await tx.wait();
      setApprovalLoading(false);
      setApprovalSuccess(true);
    } catch (error) {
      setApprovalLoading(false);
      setApprovalError(true);
      console.error(error);
    }
  };

  const migrateNFTs = async (tokenIds: number[]) => {
    const contractV2 = getContractV2();

    try {
      setMigrateLoading(true);
      const tx = await contractV2.claimAll(tokenIds);
      await tx.wait();
      console.log(tx);
      setMigrateLoading(false);
      setMigrateSuccess(true);
    } catch (error) {
      setMigrateError(true);
      setMigrateLoading(false);
      console.error(error);
    }
  };

  return {
    mintNft,
    migrateNFTs,
    approve,
    mintLoading,
    migrateLoading,
    approvalLoading,
    mintSuccess,
    migrateSuccess,
    approvalSuccess,
    mintError,
    migrateError,
    approvalError,
    getPublicSaleStatus,
    getTotalTokenCount,
    getTokenBalanceOfAddressV2,
    getIsApprovedForAll,
  };
};
