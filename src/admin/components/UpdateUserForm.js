import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner'; // Ensure correct path
import '../styles/popupForm.css';

const UpdateUserForm = ({ id, onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

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
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.data.message,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred. Please try again later.',
        });
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
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
          window.location.href = '/view-users'; // Redirect to the users list page after successful update
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      setLoading(false); // End loading
      onClose(); // Close the popup form regardless of success or failure
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
