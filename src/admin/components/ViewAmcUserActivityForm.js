import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import '../styles/popupForm.css';

const ViewAmcUserActivityForm = ({ id, onClose }) => {
  const [version, setVersion] = useState('');
  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState('');
  const [rowBefore, setRowBefore] = useState('');
  const [rowAfter, setRowAfter] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const fetchAmcUserActivityDetails = async () => {
      try {
        const response = await axiosInstance.get(`/userActivityAmc/viewActivity?id=${id}`);
        if (response.data.success) {
          const amcUserActivity = response.data.data;
          setVersion(amcUserActivity.version);
          setAction(amcUserActivity.action);
          setDescription(amcUserActivity.description);
          setUser(amcUserActivity.user);
          setRowBefore(amcUserActivity.rowBefore);
          setRowAfter(amcUserActivity.rowAfter);
          setDateTime(amcUserActivity.dateTime);
        } else {
          alert('Error fetching AMC details: ' + response.data.message);
        }
      } catch (error) {
        alert('An unexpected error occurred. Please try again later.');
      }
    };

    fetchAmcUserActivityDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>View AMC User Activity</h2>
        <form className='form'>
          <label className='label'>
            Version:
            <input
              type="text"
              value={version}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Action:
            <input
              type="text"
              value={action}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Description:
            <input
              type="text"
              value={description}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            User:
            <input
              type="text"
              value={user}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Row Before update:
            <input
              type="text"
              value={rowBefore}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Row After update:
            <input
              type="text"
              value={rowAfter}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Timestamp:
            <input
              type="text"
              value={dateTime}
              readOnly
              className='input'
            />
          </label>
          <button type="button" className='button' onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default ViewAmcUserActivityForm;
