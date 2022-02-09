import React, { FC } from 'react';
import Banner from './Banner';
import Footer from './Footer';
import Nav from './Nav';

const Layout: FC = ({ children }) => {
  return (
    <div
      style={{ backgroundColor: '#92b2bf' }}
      className='min-h-screen flex flex-col justify-between'
    >
      <div>
        <Banner />
        <Nav />
      </div>
      <main className='px-4'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
