import React from 'react';
import Image from 'next/image';

const Socials = () => {
  return (
    <div className='flex flex-row justify-center items-center'>
      <Image
        className='px-6'
        src='/discord.png'
        height='50px'
        width='50px'
        alt='discord icon'
      />
      <Image
        className='px-6'
        src='/twitter.png'
        height='50px'
        width='50px'
        alt='twitter icon'
      />
    </div>
  );
};

export default Socials;
