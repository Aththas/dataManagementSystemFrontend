import React from 'react';
import logout from '../img/logout.png';
import './Topbar.css'

const Topbar = () => {
  return (
    <div className="top-bar">
      <div className="admin">
        <div className="title">Admin Panel</div>
      </div>
      <div className="dropdown">
        <div className="user">
          <img src={logout} alt="" className="img"/>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
