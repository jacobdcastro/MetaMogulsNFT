import { useWeb3 } from '@3rdweb/hooks';
import { ConnectWallet } from '@3rdweb/react';
import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import MintSectionV1 from '../components/MintSectionV1';
import MintSectionV2 from '../components/MintSectionV2';
import { useContractV1 } from '../hooks';

const MintPage = () => {
  const { address, disconnectWallet, activeProvider } = useWeb3();
  const [_v1OwnedTokens, _setV1OwnedTokens] = useState<number[]>([]);

  const { getAllTokensOfAddressV1 } = useContractV1();

  const handleGetOwnedTokens = useCallback(async () => {
    if (address) {
      const tokens = await getAllTokensOfAddressV1(address);
      _setV1OwnedTokens(tokens);
      console.log('V1', tokens);
    }
  }, [address, getAllTokensOfAddressV1]);

  useEffect(() => {
    handleGetOwnedTokens();
  }, [address, handleGetOwnedTokens]);

  return (
    <Layout>
      <div className='h-full w-full flex flex-col justify-center items-center'>
        <h1 className='font-heading text-5xl pb-6 text-yellow-300 drop-shadow-md'>
          Minting Officially Closed!
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

        <div className='flex mx-auto'>
          {/* <div className='mr-10'>
            <MintSectionV1 _setV1OwnedTokens={_setV1OwnedTokens} />
          </div> */}
          <div className='flex items-center justify-center flex-col'>
            <MintSectionV2 _v1OwnedTokens={_v1OwnedTokens} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MintPage;
