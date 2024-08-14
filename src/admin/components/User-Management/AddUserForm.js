import React, { useState } from 'react';
import '../style/popupForm.css';
import axiosInstance from '../../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../components/loading/LoadingSpinner'; 

const AddUserForm = ({ onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/user/addUser', {
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
            window.location.href = '/view-users';
          });
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
      setLoading(false); 
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>Add New User</h2>
        {loading ? (
          <LoadingSpinner /> 
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default AddUserForm;
