import React from 'react';
import Image from 'next/image';

const Logo = (props: any) => {
  return (
    <Image
      {...props}
      src='/logo512.png'
      layout='fixed'
      height='50px'
      width='50px'
      alt='metamogul logo'
    />
  );
};

export default Logo;
