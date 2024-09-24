import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/popupForm.css';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Adjust path as necessary
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const ViewAmcUserActivityForm = ({ id, onClose }) => {
  const [version, setVersion] = useState('');
  const [action, setAction] = useState('');
  const [description, setDescription] = useState('');
  const [user, setUser] = useState('');
  const [rowBefore, setRowBefore] = useState('');
  const [rowAfter, setRowAfter] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

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

  useEffect(() => {
    const fetchAmcUserActivityDetails = async () => {
      try {
        const response = await axiosInstance.get(`/userActivityAmc/viewActivity?id=${id}`);
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
          toastr.error(response.data.message, '');
        }
      } catch (error) {
        toastr.error('An unexpected error occurred. Please try again later.', '');
      } finally {
        setLoading(false);
      }
    };

    fetchAmcUserActivityDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        {loading ? ( // Display spinner while loading
          <LoadingSpinner />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ViewAmcUserActivityForm;
