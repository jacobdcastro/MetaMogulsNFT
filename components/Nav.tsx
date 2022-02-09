import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Logo from './Logo';
import MintLink from './MintLink';
import Socials from './Socials';

const Menu = ({ setIsOpen }: { setIsOpen: (o: boolean) => void }) => {
  return (
    <div className='flex flex-col md:flex-row justify-center items-center'>
      <ul className='flex flex-col justify-center items-center font-body text-xl mt-4 text-white md:flex-row md:mt-0'>
        <li
          className='uppercase pt-3 drop-shadow-xl md:mx-3'
          onClick={() => setIsOpen(false)}
        >
          <Link href={'/#about'}>About</Link>
        </li>
        <li
          className='uppercase pt-3 drop-shadow-xl md:mx-3'
          onClick={() => setIsOpen(false)}
        >
          <Link href={'/#roadmap'}>Roadmap</Link>
        </li>
        <li
          className='uppercase pt-3 drop-shadow-xl md:mx-3'
          onClick={() => setIsOpen(false)}
        >
          <Link href={'/#team'}>Team</Link>
        </li>
        <li
          className='uppercase pt-3 drop-shadow-xl md:mx-3'
          onClick={() => setIsOpen(false)}
        >
          <Link href={'/#faq'}>FAQ</Link>
        </li>
      </ul>
      <Socials />
    </div>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className=' w-full flex flex-col mt-2 py-2'>
      <div className='flex flex-row justify-between'>
        <Logo height='70px' width='84px' />

        <Menu setIsOpen={setIsOpen} />

        <div className='flex flex-row mr-3'>
          <MintLink />
          <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
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

      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </nav>
  );
};

export default Nav;
