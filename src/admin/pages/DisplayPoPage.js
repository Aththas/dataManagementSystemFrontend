import React, { useEffect, useState } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance'; // Import your axios instance
import '../styles/viewUsersPage.css';
import Sidebar from '../common/sidebar/Sidebar';
import Topbar from '../common/topbar/Topbar';
import LoadingSpinner from '../../components/loading/LoadingSpinner'; // Import your spinner component
import ViewPoList from '../components/PO-Management/PO/ViewPoList';

const DisplayPoPage = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Attempt to fetch a small amount of data to validate the token
        await axiosInstance.get('/po/viewAllPoList?page=0&size=1&sortBy=id&ascending=true');
        setAuthorized(true); // Token is valid
      } catch (error) {
        // If the request fails (due to invalid token or other reasons)
        setAuthorized(false); // Token is invalid
        window.location.href = '/login'; // Redirect to login
      } finally {
        setLoading(false); // Hide the spinner after check
      }
    };

    checkAuthorization();
  }, []);

  if (loading) {
    return <LoadingSpinner />; // Render spinner while loading
  }

  if (!authorized) {
    return null; // Do not render anything if not authorized
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <Topbar />
        <ViewPoList/>
      </div>
    </div>
  );
};

export default DisplayPoPage;
