import { Contract, BigNumber } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import _abi from '../config/abi.json';
import abi from '../config/abi2.json';
import CONFIG from '../config/config.json';
import { useCallback, useMemo, useState } from 'react';

// mainnet
const CONTRACT_ADDRESS_V1 = '0x5d6685C7BD265204ec9BDE279095CBF478165898';
const CONTRACT_ADDRESS_V2 = '0x490241c095c83720133EFb32358C1A8059C9DAAB';

// rinkeby
// const CONTRACT_ADDRESS_V1 = '0xcFc9B95f2678D38eF3BB56CA148c1655A970E037';
// const CONTRACT_ADDRESS_V2 = '0xB752371A0C4F53da11EFcc7F7771Ad7A5A4b5d51';

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

  const [migrationTxHash, setMigrationTxHash] = useState<string | null>();

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
    return await contractV2.getCurrentMintedSupply();
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
      setMigrationTxHash(tx.hash);
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
    migrationTxHash,
  };
};
