import Link from 'next/link';
import React from 'react';

const MintLink = () => {
  return (
    <Link href='/migrate' passHref>
      <div className='bg-yellow-300 font-body flex justify-center items-center shadow-lg rounded-lg px-3 py-2 hover:cursor-pointer'>
        Migrate V1 Moguls
      </div>
    </Link>
  );
};

export default MintLink;
