import React, { FC } from 'react';
import Banner from './Banner';
import Footer from './Footer';
import Nav from './Nav';

const Layout: FC = ({ children }) => {
  return (
    <div className='bg-slate-400'>
      <Banner />
      <Nav />
      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
