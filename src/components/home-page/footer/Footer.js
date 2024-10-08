import React from 'react';
import facebook from './img/sm1.png';
import instagram from './img/sm2.png';
import twitter from './img/sm3.png';
import youtube from './img/sm4.png';

const Footer = () => {
  return (
    <section id="footer">
      <div className="footer container">
        <div className="brand">
          <h1><span>M</span>obitel <span>D</span>ata <span>M</span>anagement</h1>
        </div>
        <h2>A web application used to manage the user activity with data management at mobitel information systems division</h2>
        <div className="social-icon">
          <div className="social-item">
            <a href="https://facebook.com/Mobitel" target="_blank" rel="noopener noreferrer">
              <img src={facebook} alt="Facebook" />
            </a>
          </div>
          <div className="social-item">
            <a href="https://instagram.com/mobitelsrilanka" target="_blank" rel="noopener noreferrer">
              <img src={instagram} alt="Instagram" />
            </a>
          </div>
          <div className="social-item">
            <a href="https://twitter.com/MobitelSriLanka" target="_blank" rel="noopener noreferrer">
              <img src={twitter} alt="Twitter" />
            </a>
          </div>
          <div className="social-item">
            <a href="https://www.youtube.com/@SLTMobitel" target="_blank" rel="noopener noreferrer">
              <img src={youtube} alt="YouTube" />
            </a>
          </div>
        </div>
        <p>Copyright © 2024 Aththas Rizwan. All rights reserved</p>
      </div>
    </section>
  );
};

export default Footer;
