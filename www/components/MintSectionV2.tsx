import { useWeb3 } from '@3rdweb/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useContractV2 } from '../hooks';

const MintSectionV2 = ({ _v1OwnedTokens }: { _v1OwnedTokens: number[] }) => {
  const [count, setCount] = useState(1);
  const { address, disconnectWallet, activeProvider } = useWeb3();

  const {
    mintNft: mintNftV2,
    migrateNFTs,
    approve,
    getPublicSaleStatus: getPublicSaleStatusV2,
    getTotalTokenCount: getTotalTokenCountV2,
    getTokenBalanceOfAddressV2,
    mintLoading,
    mintSuccess,
    mintError,
    migrateLoading,
    migrateSuccess,
    migrateError,
    approvalError,
    approvalLoading,
    approvalSuccess,
    getIsApprovedForAll,
  } = useContractV2();

  const [tokenCountV2, setTokenCountV2] = useState('???');
  const [v2TokenBalance, setV2TokenBalance] = useState<number>(0);
  const [saleIsOpen, setSaleIsOpen] = useState<boolean | null>(null);
  const [isApprovedForAll, setIsApprovedForAll] = useState<boolean>(false);

  const handleCount = useCallback(async () => {
    if (address) {
      const res = await getTotalTokenCountV2();
      setTokenCountV2(parseInt(res._hex, 16).toString());
      const _res = await getTokenBalanceOfAddressV2(address);
      setV2TokenBalance(_res);
    }
  }, [address, getTokenBalanceOfAddressV2, getTotalTokenCountV2]);

  const handleOpen = useCallback(async () => {
    if (address) {
      const res = await getPublicSaleStatusV2();
      setSaleIsOpen(res);
    }
  }, [address, getPublicSaleStatusV2]);

  const handleGetApproved = useCallback(async () => {
    if (address) {
      const res = await getIsApprovedForAll();
      setIsApprovedForAll(res);
    }
  }, [address, getIsApprovedForAll]);

  useEffect(() => {
    handleCount();
    handleOpen();
    handleGetApproved();
  }, [
    address,
    handleCount,
    handleGetApproved,
    handleOpen,
    mintSuccess,
    migrateSuccess,
    approvalSuccess,
  ]);

  console.log(_v1OwnedTokens);

  return (
    <>
      <h1 className='font-heading text-4xl text-center'>V2</h1>
      <div className='w-full max-w-md bg-yellow-300 p-8 rounded-2xl flex flex-col items-center'>
        <h2 className='font-heading text-4xl text-center'>
          Already Minted:
          <br />
          {`${tokenCountV2}/1111`}
        </h2>

        <div className='flex items-center my-2'>
          <button
            className='font-heading text-4xl bg-slate-500 pb-2 px-3 rounded-2xl text-white'
            onClick={() => {
              if (count > 1) setCount(count - 1);
            }}
          >
            -
          </button>
          <h3 className='font-heading text-4xl bg-white rounded-2xl p-5 mx-5 w-28 text-center'>
            {count}
          </h3>
          <button
            className='font-heading text-4xl bg-slate-500 pb-2 px-3 rounded-2xl text-white'
            onClick={() => {
              if (count < 10) setCount(count + 1);
            }}
          >
            +
          </button>
        </div>

        <div className='my-4'>
          {mintLoading ? (
            <h3 className='font-heading text-3xl text-center'>
              Minting your Meta Moguls now...
            </h3>
          ) : mintError ? (
            <h3 className='font-heading text-3xl text-center'>
              Oops, something went wrong!
            </h3>
          ) : mintSuccess ? (
            <h3 className='font-heading text-3xl text-center'>
              You have successfully minted {count} Meta Moguls!!
            </h3>
          ) : (
            // <button
            //   className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:${
            //     saleIsOpen ? 'cursor-pointer' : 'cursor-not-allowed'
            //   }`}
            //   disabled={!address}
            //   onClick={async () => {
            //     if (address) {
            //       if (saleIsOpen) await mintNft(count);
            //     }
            //   }}
            // >
            //   {address
            //     ? saleIsOpen
            //       ? 'Mint Now'
            //       : 'Minting Starting Soon!'
            //     : 'Please Connect Wallet First'}
            // </button>
            <button
              className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:cursor-pointer`}
              disabled={!address}
              onClick={async () => {
                if (address) {
                  await mintNftV2(count);
                }
              }}
            >
              {address ? 'Mint Now' : 'Please Connect Wallet First'}
            </button>
          )}
        </div>
      </div>
      {_v1OwnedTokens.length > 0 && (
        <div className='w-full max-w-md bg-yellow-300 p-8 rounded-2xl flex flex-col items-center mt-8 font-heading'>
          <h3>
            {migrateLoading
              ? 'Migrating your NFTs now...'
              : migrateError
              ? 'Oops, something went wrong migrating!'
              : migrateSuccess
              ? "You've successfully migrated to the new contract!"
              : `You own ${v2TokenBalance} NFTs on the V2 contract`}
          </h3>
          <div>
            <h4 className='text-center mt-5 mb-2'>
              Step 1{isApprovedForAll && ' complete!'}
            </h4>
            {isApprovedForAll ? (
              <>
                <h4 className='text-center mt-5 mb-2'>Step 2</h4>
                <button
                  className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:cursor-pointer`}
                  // disabled={v1OwnedTokens.length === 0}
                  onClick={() => migrateNFTs(_v1OwnedTokens)}
                >
                  Migrate V1 NFTs to V2
                </button>
              </>
            ) : migrateLoading ? (
              <h4>Migrating to V2 now...</h4>
            ) : migrateSuccess ? (
              <h4>Successfully migrated!</h4>
            ) : migrateError ? (
              <h4>Hmm... something went wrong. Please reach out on discord!</h4>
            ) : (
              <button
                className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:cursor-pointer`}
                onClick={() => approve()}
              >
                Approve Contract Migration
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MintSectionV2;
