import React from 'react';
import Image from 'next/image';

const Socials = () => {
  return (
    <div className='flex flex-row justify-between items-center w-24 mx-auto md:mt-4'>
      <a
        href='https://discord.com/invite/pDEGn6fGwc'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          className='mx-10 flex-grow-0'
          src='/discord.png'
          height='50px'
          width='50px'
          alt='discord icon'
        />
      </a>
      <a
        href='https://twitter.com/MetaMogulsNFT'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          className='mx-10 flex-grow-0'
          src='/twitter.png'
          height='50px'
          width='50px'
          alt='twitter icon'
        />
      </a>
      <a
        href='https://opensea.io/collection/meta-moguls-genesis'
        target='_blank'
        rel='noreferrer'
      >
        <Image
          className='mx-10 flex-grow-0'
          src='/opensea.png'
          height='50px'
          width='50px'
          alt='opensea icon'
        />
      </a>
    </div>
  );
};

export default Socials;
