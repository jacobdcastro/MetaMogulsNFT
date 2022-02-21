import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThirdwebProvider } from '@3rdweb/react';

const supportedChainIds = [1, 4];

const connectors = {
  injected: {},
  walletconnect: {},
  walletlink: {
    appName: 'MetaMogulsNFT',
    url: 'https://metamoguls.art',
    darkMode: false,
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Meta Moguls NFT</title>
      </Head>
      <ThirdwebProvider
        connectors={connectors}
        supportedChainIds={supportedChainIds}
      >
        <Component {...pageProps} />
      </ThirdwebProvider>
    </>
  );
}

export default MyApp;
