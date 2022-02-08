import React from 'react';
import MintLink from './MintLink';
import Socials from './Socials';

const Footer = () => {
  return (
    <div className='flex flex-col mt-10'>
      <img src='/logo.png' />
      <div>
        <Socials />
        <MintLink />
      </div>
    </div>
  );
};

export default Footer;
