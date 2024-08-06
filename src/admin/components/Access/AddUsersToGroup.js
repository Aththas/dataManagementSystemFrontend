import React, { useState, useEffect } from 'react';
import '../../styles/popupForm.css';
import axiosInstance from '../../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../components/LoadingSpinner'; // Ensure correct path to your component

const AddUsersToGroup = ({ onClose }) => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [users, setUsers] = useState([]); // State to hold the user data

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get('/grp/getAllNonMyGrpUsers');
        if (response.data.success) {
          setUsers(response.data.data || []); // Set users if response is successful
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
        setLoading(false); // Stop loading
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    try {
      const response = await axiosInstance.post('/grp/addToGrp', {
        userId,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
          window.location.href = '/provide-access-manual';
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
      setLoading(false); // Set loading to false when the request completes
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className="h2">Add Users to View My Updates</h2>
        {loading ? (
          <LoadingSpinner /> // Show the spinner when loading
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <label className='label'>
              User Email:
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className='input'
              >
                <option value="" disabled>Select Users</option>
                {users.map(user => (
                  <option key={user.userId} value={user.userId}>
                    {user.email}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="button">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddUsersToGroup;
