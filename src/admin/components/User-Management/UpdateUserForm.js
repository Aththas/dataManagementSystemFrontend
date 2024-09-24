import React, { useState, useEffect } from 'react';
import axiosInstance from '../../tokenValidation/axiosInstance';
import LoadingSpinner from '../../../components/loading/LoadingSpinner'; // Ensure correct path
import '../style/popupForm.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../style/toastr.css';

const UpdateUserForm = ({ id, onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right',
    timeOut: 3000,
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    showDuration: 300,
    hideDuration: 300,
    tapToDismiss: false,
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(`/user/viewUser?id=${id}`);
        if (response.data.success) {
          const user = response.data.data;
          setFirstname(user.firstname);
          setLastname(user.lastname);
          setEmail(user.email);
          setRole(user.role);
        } else {
          toastr.error(response.data.message, '');
        }
      } catch (error) {
        toastr.error('An unexpected error occurred. Please try again later.', '');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.put(`/user/updateUser?id=${id}`, {
        firstname,
        lastname,
        email,
        role,
      });

      if (response.data.success) {
        toastr.success(response.data.message, '');
        setTimeout(() => {
          window.location.href = '/mobiDM/view-users';
        }, 2000);
      } else {
        toastr.error(response.data.message, '');
      }
    } catch (error) {
      toastr.error('An unexpected error occurred. Please try again later.', '');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {loading && <LoadingSpinner />} {/* Render spinner if loading */}
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>Update User</h2>
        <form onSubmit={handleSubmit} className='form'>
          <label className='label'>
            First Name:
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Last Name:
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Role:
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className='input'
            >
              <option value="" disabled>Select Role</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </label>
          <button type="submit" className='button'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserForm;
