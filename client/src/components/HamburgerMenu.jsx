import React from 'react';

const HamburgerMenu = ({ onClick }) => {
  return (
    <button onClick={onClick} className="hamburger-menu">
      ☰
    </button>
  );
};

export default HamburgerMenu;