import React, { useEffect, useState } from 'react';
import axiosInstance from '../../tokenValidation/axiosInstance';
import logout from './img/power.png';
import mobitel from './img/img_401.png';
import './Topbar.css';
import Swal from 'sweetalert2';

const Topbar = () => {
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
  
  const handleLogout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout!?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.post('/auth/logout');
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');

            window.location.href = '/mobiDM/login';

        } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: 'An error occurred during logout. Please try again.',
        });
        }
      }
    });
  };

  return (
    <div className="top-bar">
      <div className="admin" style={{height:'100%'}}>
      <img src={mobitel} alt="mobitel" className="img" style={{height:'100%', borderRadius:0, left:'-128px',objectFit: 'cover',boxShadow:'none'}}/>
        {/*<div className="title">
            Admin Panel : Welcome back {user ? `${user.firstname} ${user.lastname}` : 'Bad connenction...'}
        </div>*/}
      </div>
      <div className="dropdown" style={{marginRight:'50px'}}>
        <div className="user" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="img" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
