import React, { useEffect, useState } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import logout from '../img/logout.png';
import './Topbar.css';
import Swal from 'sweetalert2'; // Assuming you are using SweetAlert for alerts

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
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
      }).then(() => {
        window.location.href = '/login';
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'An error occurred during logout. Please try again.',
      });
    }
  };

  return (
    <div className="top-bar">
      <div className="admin">
        <div className="title">
          Admin Panel : Welcome back {user ? user.email : 'Admin'}
        </div>
      </div>
      <div className="dropdown">
        <div className="user" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="img" />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
