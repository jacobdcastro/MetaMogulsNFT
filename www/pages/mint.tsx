import { useWeb3 } from '@3rdweb/hooks';
import { ConnectWallet } from '@3rdweb/react';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
// @ts-ignore
import DateCountdown from 'react-date-countdown-timer';
import Countdown from '../components/Countdown';
import { useMint } from '../hooks/useMint';
import { BigNumber } from 'ethers';

const MintPage = () => {
  const [count, setCount] = useState(1);
  const { address, disconnectWallet, activeProvider } = useWeb3();
  const {
    mintNft,
    getPublicSaleStatus,
    getTokenCount,
    loading,
    error,
    success,
  } = useMint();
  const [tokenCount, setTokenCount] = useState('???');
  const [saleIsOpen, setSaleIsOpen] = useState<boolean | null>(null);

  const handleCount = useCallback(async () => {
    if (address) {
      const res = await getTokenCount();
      setTokenCount(parseInt(res._hex, 16).toString());
    }
  }, [address, getTokenCount]);

  const handleOpen = useCallback(async () => {
    if (address) {
      const res = await getPublicSaleStatus();
      setSaleIsOpen(res);
    }
  }, [address, getPublicSaleStatus]);

  useEffect(() => {
    handleCount();
  }, [address, handleCount]);

  useEffect(() => {
    handleOpen();
  }, [address, getPublicSaleStatus, handleCount, handleOpen]);

  return (
    <Layout>
      <div className='h-full w-full flex flex-col justify-center items-center'>
        <h1 className='font-heading text-5xl pb-6 text-yellow-300 drop-shadow-md'>
          Mint a Mogul
        </h1>

        {/* <Countdown /> */}

        <div className='w-full max-w-md bg-white p-8 rounded-2xl mb-8 flex flex-col items-center'>
          <ConnectWallet />
          {address && (
            <button
              className='p-3 bg-red-600 rounded-full text-white font-heading w-full hover:cursor-pointer mt-4'
              onClick={() => {
                if (activeProvider?.isMetaMask) {
                } else {
                  disconnectWallet();
                }
              }}
            >
              Disconnect Wallet
            </button>
          )}
        </div>

        <div className='w-full max-w-md bg-yellow-300 p-8 rounded-2xl flex flex-col items-center'>
          <h2 className='font-heading text-4xl text-center'>
            Already Minted:
            <br />
            {`${tokenCount}/1111`}
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
            {loading ? (
              <h3 className='font-heading text-3xl text-center'>
                Minting your Meta Moguls now...
              </h3>
            ) : error ? (
              <h3 className='font-heading text-3xl text-center'>
                Oops, something went wrong!
              </h3>
            ) : success ? (
              <h3 className='font-heading text-3xl text-center'>
                You have successfully minted your Meta Moguls!!
              </h3>
            ) : (
              <button
                className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:${
                  saleIsOpen ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                disabled={!address}
                onClick={async () => {
                  if (address) {
                    if (saleIsOpen) await mintNft(count);
                  }
                }}
              >
                {address
                  ? saleIsOpen
                    ? 'Mint Now'
                    : 'Minting Starting Soon!'
                  : 'Please Connect Wallet First'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MintPage;