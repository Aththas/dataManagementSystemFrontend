import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/ViewUser.css';
import csv from './img/csv.png';
import ViewPoUserActivityForm from './ViewPoUserActivityForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

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

  const handleFile = async (filePath) => {
    try {
      console.log(filePath);
      const response = await axiosInstance.post('/file', { readFile: filePath }, {
          responseType: 'json'
      });
      const { fileName, fileContent } = response.data.data;
      console.log(response.data);
      console.log(response.data.data);

      // Decode Base64 to binary before creating the Blob
      const decodedData = atob(fileContent);
      const byteArray = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
          byteArray[i] = decodedData.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: 'text/csv;charset=utf-8;' });
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
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
                   onClick={() => handleFile(activity.beforeFile)}
                   style={{cursor:'pointer'}}
                   />
                  ) : (
                    <img
                      src={csv}
                      alt="csv file"
                      className="tbl-user"
                      onClick={() => toastr.error('You do not have permission to view this file', '')}
                      style={{ cursor: 'pointer'}}
                    />
                  )}
                </td>
                <td>
                  {user && user.viewPermission ? (
                   <img src={csv} alt="csv file" className="tbl-user" 
                   onClick={() => handleFile(activity.afterFile)}
                   style={{cursor:'pointer'}}
                   />
                  ) : (
                    <img
                      src={csv}
                      alt="csv file"
                      className="tbl-user"
                      onClick={() => toastr.error('You do not have permission to view this file', '')}
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
