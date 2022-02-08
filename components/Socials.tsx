import React from 'react';
import Image from 'next/image';

const Socials = () => {
  return (
    <div>
      <Image src='/discord.png' height='50px' width='50px' alt='discord icon' />
      <Image src='/twitter.png' height='50px' width='50px' alt='twitter icon' />
    </div>
  );
};

export default Socials;
