import Link from 'next/link';
import React from 'react';

const MintLink = () => {
  return (
    <Link href='/mint' passHref>
      <div className='bg-yellow-300 font-body flex justify-center items-center shadow-lg rounded-lg p-3'>
        Mint a Mogul
      </div>
    </Link>
  );
};

export default MintLink;
