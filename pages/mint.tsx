import { ConnectWallet } from '@3rdweb/react';
import React from 'react';
import Layout from '../components/Layout';

const MintPage = () => {
  return (
    <Layout>
      <ConnectWallet />
    </Layout>
  );
};

export default MintPage;
