import { useWeb3 } from '@3rdweb/hooks';
import { ConnectWallet } from '@3rdweb/react';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useContractV1 } from '../hooks';

const CloseSalePage = () => {
  const { address, disconnectWallet, activeProvider } = useWeb3();
  const [saleIsOpen, setSaleIsOpen] = useState<boolean | null>(null);
  const {
    closeSale,
    closeLoading,
    closeSuccess,
    closeError,
    getPublicSaleStatus,
    getAllowListSaleStatus,
  } = useContractV1();

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
    handleSaleStatus();
  }, [address, handleSaleStatus, closeLoading, closeSuccess, closeError]);

  return (
    <Layout>
      <div className='h-full w-full flex flex-col justify-center items-center'>
        <h1 className='font-heading text-5xl pb-6 text-yellow-300 drop-shadow-md'>
          Close the Sale
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

        <div className='w-full max-w-md bg-yellow-300 p-8 rounded-2xl flex flex-col items-center mt-8 font-heading'>
          {saleIsOpen ? (
            <button
              className={`p-5 bg-red-600 rounded-2xl text-white font-heading hover:cursor-pointer`}
              onClick={async () => {
                if (address) {
                  await closeSale();
                }
              }}
            >
              Close Public Sale
            </button>
          ) : (
            <h3>Sale is Closed!</h3>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CloseSalePage;
