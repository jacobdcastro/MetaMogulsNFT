import { providers, Contract, utils } from 'ethers';
import { useWeb3 } from '@3rdweb/hooks';
import abi from '../config/abi.json';
import { useState } from 'react';

const CONTRACT_ADDRESS = '0x5d6685C7BD265204ec9BDE279095CBF478165898';

export const useMint = () => {
  const [loading, setLoading] = useState(false);
  const { provider } = useWeb3();

  const getContract = () => {
    const signer = provider?.getSigner();
    return new Contract(CONTRACT_ADDRESS, abi, signer);
  };

  console.log('hi', utils.parseUnits('0.05', 'ether'));

  const mintPresale = async () => {
    const contract = getContract();
    console.log(utils.parseEther('0.05'));
    // const tx = await contract.mint({
    //   value: utils.parseEther('0.05'),
    // });
    // // const tx = await contract.name();

    // setLoading(true);
    // await tx.wait();
    // console.log(tx);
    // setLoading(false);
  };

  // @ts-ignore
  // const web3Provider = new providers.Web3Provider(provider);

  // const getNetwork = async () => {
  //   const { chainId } = await web3Provider.getNetwork();
  //   console.log(chainId);
  // };

  return { mintPresale };
};
