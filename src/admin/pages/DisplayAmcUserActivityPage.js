import React, { useEffect, useState } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance'; // Import your axios instance
import '../styles/viewUsersPage.css';
import Sidebar from '../common/sidebar/Sidebar';
import Topbar from '../common/topbar/Topbar';
import LoadingSpinner from '../../components/loading/LoadingSpinner'; // Import your spinner component
import ViewAmcUserActivity from '../components/Amc-Management/User-Activity/ViewAmcUserActivity';

const DisplayAmcUserActivityPage = () => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Attempt to fetch a small amount of data to validate the token
        await axiosInstance.get('userActivityAmc/viewAllActivities?page=0&size=1&sortBy=id&ascending=false');
        setAuthorized(true); // Token is valid
      } catch (error) {
        // If the request fails (due to invalid token or other reasons)
        setAuthorized(false); // Token is invalid
        window.location.href = '/mobiDM/login'; // Redirect to login
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
        <ViewAmcUserActivity />
      </div>
    </div>
  );
};

export default DisplayAmcUserActivityPage;
