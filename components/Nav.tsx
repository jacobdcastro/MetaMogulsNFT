import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Logo from './Logo';
import MintLink from './MintLink';
import Socials from './Socials';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className=' w-full flex flex-col mt-2'>
      <div className='flex flex-row justify-between'>
        <Logo height='70px' width='84px' />

        <div className='flex flex-row'>
          <MintLink />
          <button className='mx-3' onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <Image
                src='/close.png'
                height='35px'
                width='35px'
                alt='menu icon'
              />
            ) : (
              <Image
                src='/hamburger.png'
                height='35px'
                width='35px'
                alt='menu icon'
              />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div>
          <ul className='flex flex-col justify-center items-center font-body text-xl mt-4 text-white'>
            <li
              className='uppercase pt-3 drop-shadow-xl'
              onClick={() => setIsOpen(false)}
            >
              <Link href={'/#about'}>About</Link>
            </li>
            <li
              className='uppercase pt-3 drop-shadow-xl'
              onClick={() => setIsOpen(false)}
            >
              <Link href={'/#roadmap'}>Roadmap</Link>
            </li>
            <li
              className='uppercase pt-3 drop-shadow-xl'
              onClick={() => setIsOpen(false)}
            >
              <Link href={'/#team'}>Team</Link>
            </li>
            <li
              className='uppercase pt-3 drop-shadow-xl'
              onClick={() => setIsOpen(false)}
            >
              <Link href={'/#faq'}>FAQ</Link>
            </li>
          </ul>
          <Socials />
        </div>
      )}
    </nav>
  );
};

export default Nav;
