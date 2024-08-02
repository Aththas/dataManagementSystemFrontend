import React, { useEffect, useState } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faBook, faUser, faUserCircle, faClipboardList, faCog } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get('/auth/user-info');
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          console.error('Error fetching user details:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/AMC">
          <FontAwesomeIcon icon={faThLarge} className="icon" />
            <div className="title">Dashboard</div>
          </a>
        </li>
        {user && user.role === 'ADMIN' && (
          <li>
            <a href="/view-users" style={{marginLeft: '10px'}}>
            <FontAwesomeIcon icon={faUser} className="icon" />
              <div className="title">Users</div>
            </a>
          </li>
        )}

        <li>
          <a href="/AMC"  style={{marginLeft: '10px'}}>
            <FontAwesomeIcon icon={faBook} className="icon" />
            <div className="title">AMC Contract</div>
          </a>
        </li>
        <li>
          <a href="/PO"  style={{marginLeft: '10px'}}>
            <FontAwesomeIcon icon={faClipboardList} className="icon" />
            <div className="title">PO Details</div>
          </a>
        </li>
        <li>
          <a href="/user-activity"  style={{marginLeft: '10px'}}>
            <FontAwesomeIcon icon={faUserCircle} className="icon" />
            <div className="title">User Activity</div>
          </a>
        </li>
        <li>
          <a href="/user-profile"  style={{marginLeft: '10px'}}>
            <FontAwesomeIcon icon={faCog} className="icon" />
            <div className="title">Profile</div>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
