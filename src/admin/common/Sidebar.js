import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/dashboard">
            <i className="fas fa-th-large"></i>
            <div className="title">Dashboard</div>
          </a>
        </li>
        <li>
          <a href="/books">
            <i className="fad fa-book"></i>
            <div className="title">Books</div>
          </a>
        </li>
        <li>
          <a href="/tasks">
            <i className="fad fa-clipboard-list-check"></i>
            <div className="title">Tasks</div>
          </a>
        </li>
        <li>
          <a href="/students">
            <i className="fas fa-user"></i>
            <div className="title">Student Details</div>
          </a>
        </li>
        <li>
          <a href="/staffs">
            <i className="fas fa-user-circle"></i>
            <div className="title">Staff Details</div>
          </a>
        </li>
        <li>
          <a href="/resources">
            <i className="fas fa-cart-arrow-down"></i>
            <div className="title">Resources</div>
          </a>
        </li>
        <li>
          <a href="/innovations">
            <i className="fas fa-hand-holding-usd"></i>
            <div className="title">Innovations</div>
          </a>
        </li>
        <li>
          <a href="/reports">
            <i className="fad fa-clipboard-list"></i>
            <div className="title">Reports</div>
          </a>
        </li>
        <li>
          <a href="/profile">
            <i className="fas fa-cog"></i>
            <div className="title">Profile</div>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
