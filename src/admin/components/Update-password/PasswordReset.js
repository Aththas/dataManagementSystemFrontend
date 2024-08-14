import React, { useState } from 'react';
import '../style/popupForm.css';
import axiosInstance from '../../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../components/loading/LoadingSpinner'; // Ensure correct path to your LoadingSpinner component

const PasswordReset = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading spinner

    try {
      const response = await axiosInstance.post('/password/password-reset', {
        password,
        newPassword,
        confirmPassword,
      });

      setLoading(false); // Stop loading spinner

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
            window.location.href = '/user-profile';
          });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      setLoading(false); // Stop loading spinner
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="popup-overlay">
      {loading && <LoadingSpinner />} {/* Conditionally render LoadingSpinner */}
      <div className="popup-content">
        <h2 className='h2'>Password Update</h2>
        <form onSubmit={handleSubmit} className='form'>
          <label className='label'>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className='input'
            />
          </label>
          <button type="submit" className='button' disabled={loading}>Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
