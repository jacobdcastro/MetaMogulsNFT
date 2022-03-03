import { useWeb3 } from '@3rdweb/hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useContractV1 } from '../hooks';

const MintSectionV1 = ({ _setV1OwnedTokens }: any) => {
  const [count, setCount] = useState(1);
  const { address } = useWeb3();

  const {
    mintNft: mintNftV1,
    getPublicSaleStatus: getPublicSaleStatusV1,
    getTotalTokenCount: getTotalTokenCountV1,
    getAllTokensOfAddressV1: getAllTokensOfAddressV1,
    loading: loadingV1,
    error: errorV1,
    success: successV1,
    getAllowListSaleStatus,
    getPublicSaleStatus,
    closeLoading,
    closeSuccess,
    closeError,
    closeSale,
  } = useContractV1();

  const [tokenCountV1, setTokenCountV1] = useState('???');
  const [ownedTokens, setOwnedTokens] = useState<number[]>([]);
  const [saleIsOpen, setSaleIsOpen] = useState<boolean | null>(null);

  const handleCount = useCallback(async () => {
    if (address) {
      const res = await getTotalTokenCountV1();
      setTokenCountV1(parseInt(res._hex, 16).toString());
    }
  }, [address, getTotalTokenCountV1]);

  const handleOpen = useCallback(async () => {
    if (address) {
      const res = await getPublicSaleStatusV1();
      setSaleIsOpen(res);
    }
  }, [address, getPublicSaleStatusV1]);

  const handleGetOwnedTokens = useCallback(async () => {
    if (address) {
      const tokens = await getAllTokensOfAddressV1(address);
      setOwnedTokens(tokens);
      _setV1OwnedTokens(tokens);
      console.log('V1', tokens);
    }
  }, [_setV1OwnedTokens, address, getAllTokensOfAddressV1]);

  const handleSaleStatus = useCallback(async () => {
    if (address) {
      const _res = await getPublicSaleStatus();
      const res = await getAllowListSaleStatus();
      if (_res && res) setSaleIsOpen(true);
      else setSaleIsOpen(false);
    } else {
      setSaleIsOpen(false);
    }
  }, [address, getAllowListSaleStatus, getPublicSaleStatus]);

  useEffect(() => {
    handleCount();
    handleOpen();
    handleGetOwnedTokens();
    handleSaleStatus();
  }, [
    address,
    handleCount,
    handleGetOwnedTokens,
    handleOpen,
    handleSaleStatus,
    loadingV1,
    successV1,
    closeLoading,
    closeSuccess,
    closeError,
  ]);

  console.log(saleIsOpen);

  return (
    <>
      <div className='w-full max-w-md bg-yellow-300 p-8 rounded-2xl flex flex-col items-center'>
        <h2 className='font-heading text-4xl text-center'>
          Already Minted:
          <br />
          {`${tokenCountV1}/1111`}
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
          {loadingV1 ? (
            <h3 className='font-heading text-3xl text-center'>
              Minting your Meta Moguls now...
            </h3>
          ) : errorV1 ? (
            <h3 className='font-heading text-3xl text-center'>
              Oops, something went wrong!
            </h3>
          ) : successV1 ? (
            <h3 className='font-heading text-3xl text-center'>
              You have successfully minted {count} Meta Moguls!!
            </h3>
          ) : (
            saleIsOpen && (
              <button
                className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:cursor-pointer`}
                disabled={!address}
                onClick={async () => {
                  if (address) {
                    await mintNftV1(count);
                  }
                }}
              >
                {address ? 'Mint Now' : 'Please Connect Wallet First'}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default MintSectionV1;
