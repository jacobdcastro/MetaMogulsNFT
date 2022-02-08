import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = (props: any) => {
  return (
    <Link href='/' passHref>
      <Image
        src='/logo512.png'
        layout='fixed'
        height='50px'
        width='50px'
        alt='metamogul logo'
        {...props}
      />
    </Link>
  );
};

export default Logo;
