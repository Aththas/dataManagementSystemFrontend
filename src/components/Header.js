import React, { useEffect, useRef } from 'react';

const Header = () => {
  const headerRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    const hamburger = hamburgerRef.current;
    const mobileMenu = mobileMenuRef.current;

    const handleScroll = () => {
      if (window.scrollY > 150) {
        header.style.backgroundColor = 'black';
      } else {
        header.style.backgroundColor = 'transparent';
      }
    };

    const handleHamburgerClick = () => {
      console.log('Hamburger clicked');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    };

    const handleMenuClick = () => {
      console.log('Menu item clicked');
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    };

    document.addEventListener('scroll', handleScroll);
    hamburger.addEventListener('click', handleHamburgerClick);

    const menuItems = mobileMenu.querySelectorAll('li a');
    menuItems.forEach((item) => {
      item.addEventListener('click', handleMenuClick);
    });

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('scroll', handleScroll);
      hamburger.removeEventListener('click', handleHamburgerClick);
      menuItems.forEach((item) => {
        item.removeEventListener('click', handleMenuClick);
      });
    };
  }, []);

  return (
    <section id="header">
    <div className="header container" ref={headerRef}>
      <div className="nav-bar">
        <div className="brand">
          <a href="/"><h1><span>M</span>D<span>M</span></h1></a>
        </div>
        <div className="nav-list">
          <div className="hamburger" ref={hamburgerRef}>
            <div className="bar"></div>
          </div>
          <ul ref={mobileMenuRef}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li><a href="/login" data-after="Admin Login">Login</a></li>
          </ul>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Header;
