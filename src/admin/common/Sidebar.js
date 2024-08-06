import React, { useEffect, useState } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThLarge, faBook, faUser, faClipboardList, faCog, faChevronDown, faChevronUp, faCheckCircle, faShieldAlt, faKey } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [isAmcSublistOpen, setIsAmcSublistOpen] = useState(false);
  const [isPoSublistOpen, setIsPoSublistOpen] = useState(false);
  const [isAccessSublistOpen, setIsAccessSublistOpen] = useState(false);

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

  const toggleAmcSublist = () => {
    setIsAmcSublistOpen(!isAmcSublistOpen);
  };

  const togglePoSublist = () => {
    setIsPoSublistOpen(!isPoSublistOpen);
  };

  const toggleAccessSublist = () => {
    setIsAccessSublistOpen(!isAccessSublistOpen);
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <a href="/view-amcList">
            <FontAwesomeIcon icon={faThLarge} className="icon" />
            <div className="title">Dashboard</div>
          </a>
        </li>
        {user && user.role === 'ADMIN' && (
          <li>
            <a href="/view-users" style={{ marginLeft: '10px' }}>
              <FontAwesomeIcon icon={faUser} className="icon" />
              <div className="title">Users</div>
            </a>
          </li>
        )}
        <li style={{ height: isAmcSublistOpen ? 'auto' : '50px', marginBottom: isAmcSublistOpen ? '10px' : '0' }}>
          <div onClick={toggleAmcSublist} style={{ cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faBook} className="icon" style={{ color: 'white'}} />
            <div className="title" style={{ color: 'white' }}>
              AMC <FontAwesomeIcon icon={isAmcSublistOpen ? faChevronUp : faChevronDown} className="icon"/>
            </div>
          </div>
          {isAmcSublistOpen && (
            <ul className="sublist">
              <li style={{border: 'none'}}>
                <a href="/view-amcList" style={{ marginLeft: '20px'}}>
                  <FontAwesomeIcon icon={faClipboardList} className="icon" />
                  <div className="title">AMC Contract</div>
                </a>
              </li>
              <li>
                <a href="/user-activity-amc" style={{ marginLeft: '27px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                  <div className="title">User Activity AMC</div>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li style={{ height: isPoSublistOpen ? 'auto' : '50px', marginBottom: isPoSublistOpen ? '10px' : '0' }}>
          <div onClick={togglePoSublist} style={{ cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faBook} className="icon" style={{ color: 'white'}} />
            <div className="title" style={{ color: 'white' }}>
              Purchase Order <FontAwesomeIcon icon={isPoSublistOpen ? faChevronUp : faChevronDown} className="icon"/>
            </div>
          </div>
          {isPoSublistOpen && (
            <ul className="sublist">
              <li style={{border: 'none'}}>
                <a href="/view-poList" style={{ marginLeft: '20px'}}>
                  <FontAwesomeIcon icon={faClipboardList} className="icon" />
                  <div className="title">PO Details</div>
                </a>
              </li>
              <li>
                <a href="/user-activity-PO" style={{ marginLeft: '27px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="icon" />
                  <div className="title">User Activity PO</div>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li style={{ height: isAccessSublistOpen ? 'auto' : '50px', marginBottom: isAccessSublistOpen ? '10px' : '0' }}>
          <div onClick={toggleAccessSublist} style={{ cursor: 'pointer', marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faShieldAlt} className="icon" style={{ color: 'white'}} />
            <div className="title" style={{ color: 'white' }}>
              Access Controls <FontAwesomeIcon icon={isAccessSublistOpen ? faChevronUp : faChevronDown} className="icon"/>
            </div>
          </div>
          {isAccessSublistOpen && (
            <ul className="sublist">
              <li style={{border: 'none'}}>
                <a href="/provide-access-manual" style={{ marginLeft: '20px'}}>
                  <FontAwesomeIcon icon={faKey} className="icon" />
                  <div className="title" style={{fontSize:'10px'}}>Provide Access - By Manual</div>
                </a>
              </li>
              <li style={{border: 'none'}}>
                <a href="/user-group" style={{ marginLeft: '30px'}}>
                  <FontAwesomeIcon icon={faKey} className="icon" />
                  <div className="title" style={{fontSize:'10px'}}>Provide Access - By Request</div>
                </a>
              </li>
              <li>
                <a href="/user-activity-PO" style={{ marginLeft: '30px' }}>
                  <FontAwesomeIcon icon={faKey} className="icon" />
                  <div className="title" style={{fontSize:'10px'}}>Request Access</div>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a href="/user-profile" style={{ marginLeft: '10px' }}>
            <FontAwesomeIcon icon={faCog} className="icon" />
            <div className="title">Profile</div>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
