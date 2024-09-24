import React, { useState } from 'react';
import '../style/popupForm.css';
import axiosInstance from '../../tokenValidation/axiosInstance';
import LoadingSpinner from '../../../components/loading/LoadingSpinner'; 
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../style/toastr.css';

const AddUserForm = ({ onClose }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false); 

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
  };

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
