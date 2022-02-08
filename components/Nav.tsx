import React from 'react';
import Logo from './Logo';
import Socials from './Socials';

const Nav = () => {
  return (
    <div>
      <Logo />
      <ul>
        <li>About</li>
        <li>Roadmap</li>
        <li>Team</li>
        <li>FAQ</li>
      </ul>
      <Socials />
    </div>
  );
};

export default Nav;
