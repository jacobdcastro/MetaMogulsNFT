import React from 'react';
import Socials from './Socials';

const Footer = () => {
  return (
    <div className='flex flex-col mt-10 w-full'>
      <img src='/logo.png' className='w-60 h-auto m-auto' />
      <div>
        <Socials />
      </div>
    </div>
  );
};

export default Footer;
