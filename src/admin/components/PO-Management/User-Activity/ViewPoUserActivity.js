import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/ViewUser.css';
import csv from './img/csv.png';
import ViewPoUserActivityForm from './ViewPoUserActivityForm';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const ViewPoUserActivity = () => {
  const [userActivityList, setUserActivityList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [showViewForm, setShowViewForm] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);

  const fetchUserActivityList = useCallback(async () => {
    try {
      const endpoint = filter === 'all' 
        ? `/userActivityPo/viewAllActivities?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`
        : `/userActivityPo/viewAllMyActivities?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`;
      const response = await axiosInstance.get(endpoint);
      setUserActivityList(response.data.data || []); // Handle null or undefined response data
      if(response.data.data === null){
        setTotalPages(1);
      }else{
        setTotalPages(Math.ceil((response.data.message || 0) / size));
      }
    } catch (error) {
      console.error('Error fetching user activity list:', error);
      setUserActivityList([]); // Set to empty array on error
    }
  }, [page, size, sortBy, ascending, filter]);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/auth/user-info');
      if (response.data.success) {
        setUser(response.data.data);
      } else {
        console.error('Error fetching user details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  },[]);
  

  useEffect(() => {
    fetchUserActivityList();
    fetchUserDetails();
  }, [fetchUserActivityList,fetchUserDetails]);

  const handleSort = (field) => {
    setSortBy(field);
    setAscending(!ascending);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(0);
  };

  const handleView = (activityId) => {
    setCurrentActivityId(activityId);
    setShowViewForm(true);
  };

  const handleCloseForm = () => {
    setShowViewForm(false);
    setCurrentActivityId(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const filteredUserActivityList = userActivityList.filter(activity =>
    activity.user.toLowerCase().includes(searchQuery) ||
    activity.action.toLowerCase().includes(searchQuery) ||
    activity.version.toLowerCase().includes(searchQuery) ||
    new Date(activity.dateTime).toLocaleString().toLowerCase().includes(searchQuery)
  );

  const handleFile = async (filePath, version, prefix) => {
    try {
      const response = await axios.get(filePath, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        responseType: 'blob', // Handles binary data
      });
  
      // Create a URL for the file with the correct MIME type
      const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
  
      // Construct the filename dynamically with the prefix
      const filename = `${prefix} ${version}.csv`;
  
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = filename; // Use the dynamically constructed filename
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Clean up
  
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className="view-users">
      <div className="heading">
        <h2>User Activity List - PO</h2>
      </div>
      <div className="heading">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
      <div className="heading">
        <div className="pagination">
          <label>
            Entries per page:
            <select value={size} onChange={handleSizeChange}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
        <div className="pagination">
          <label>
            Filter:
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Activities</option>
              <option value="my">My Activities</option>
            </select>
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td onClick={() => handleSort('dateTime')}>Timestamp</td>
            <td onClick={() => handleSort('user')}>User</td>
            <td onClick={() => handleSort('action')}>Action</td>
            <td onClick={() => handleSort('version')}>Version</td>
            <td onClick={() => handleSort('beforeFile')}>Before File</td>
            <td onClick={() => handleSort('afterFile')}>After File</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredUserActivityList.length > 0 ? (
            filteredUserActivityList.map((activity, index) => (
              <tr key={activity.id || index}>
                <td>{index + 1 + page * size}</td>
                <td>{new Date(activity.dateTime).toLocaleString()}</td>
                <td>{activity.user}</td>
                <td>{activity.action}</td>
                <td>{activity.version}</td>
                <td>
                  {user && user.viewPermission ? (
                   <img src={csv} alt="csv file" className="tbl-user" 
                   onClick={() => handleFile(activity.beforeFile, activity.version, 'PO before')}
                   style={{cursor:'pointer'}}
                   />
                  ) : (
                    <img
                      src={csv}
                      alt="csv file"
                      className="tbl-user"
                      onClick={() => Swal.fire({
                        icon: 'error',
                        title: 'Permission Denied',
                        text: 'You do not have permission to view this file.',
                      })}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </td>
                <td>
                  {user && user.viewPermission ? (
                   <img src={csv} alt="csv file" className="tbl-user" 
                   onClick={() => handleFile(activity.afterFile, activity.version, 'PO after')}
                   style={{cursor:'pointer'}}
                   />
                  ) : (
                    <img
                      src={csv}
                      alt="csv file"
                      className="tbl-user"
                      onClick={() => Swal.fire({
                        icon: 'error',
                        title: 'Permission Denied',
                        text: 'You do not have permission to view this file.',
                      })}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </td>
                <td>
                    <FontAwesomeIcon icon={faEye} onClick={() => handleView(activity.id)} style={{color:"#2196F3", backgroundColor: 'transparent', cursor:'pointer'}}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No activities found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 === totalPages}>
          Next
        </button>
      </div>

      {showViewForm && <ViewPoUserActivityForm id={currentActivityId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewPoUserActivity;
