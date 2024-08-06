import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import '../styles/popupForm.css';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner'; // Adjust the path as necessary

const ViewPoUserActivityForm = ({ id, onClose }) => {
  const [version, setVersion] = useState('');
  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState('');
  const [rowBefore, setRowBefore] = useState('');
  const [rowAfter, setRowAfter] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAmcUserActivityDetails = async () => {
      try {
        setLoading(true); // Set loading to true when starting to fetch data
        const response = await axiosInstance.get(`/userActivityPo/viewActivity?id=${id}`);
        if (response.data.success) {
          const amcUserActivity = response.data.data;
          setVersion(amcUserActivity.version);
          setAction(amcUserActivity.action);
          setDescription(amcUserActivity.description.replace(/\n/g, "<br />")); // Use regex to replace all newlines
          setUser(amcUserActivity.user);
          setRowBefore(amcUserActivity.rowBefore);
          setRowAfter(amcUserActivity.rowAfter);
          setDateTime(amcUserActivity.dateTime);
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
        setLoading(false); // Set loading to false when data fetching is complete
      }
    };

    fetchAmcUserActivityDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {loading ? (
          <LoadingSpinner /> // Display spinner while loading
        ) : (
          <>
            <button className="popup-close" onClick={onClose}>×</button>
            <form className='form' style={{fontSize:'12px'}}>
              <label className='label'>
                <b>Version:</b> {version}
              </label>
              <label className='label'>
                <b>User:</b> {user}
              </label>
              <label className='label'>
                <b>Action:</b> {action}
              </label>
              <label className='label'>
                <b>Timestamp:</b> {dateTime}
              </label>
              <label className='label'>
                <b>Description:</b> <span dangerouslySetInnerHTML={{ __html: description }} />
              </label>
              {action === 'add' ? (
                <>
                  <label className='label'>
                    <b>Added Row:</b> {rowAfter}
                  </label>
                </>
              ) : action === 'delete' ? (
                <>
                  <label className='label'>
                    <b>Deleted Row:</b> {rowBefore}
                  </label>
                </>
              ) : (
                <>
                  <label className='label'>
                    <b>Row Before update:</b> {rowBefore}
                  </label>
                  <label className='label'>
                    <b>Row After update:</b> {rowAfter}
                  </label>
                </>
              )}
              <button type="button" className='button' onClick={onClose}>Close</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPoUserActivityForm;
