import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import './ViewUser.css';
import csv from '../img/csv.png';
import ViewAmcUserActivityForm from './ViewAmcUserActivityForm';
import Swal from 'sweetalert2';

const ViewAmcUserActivity = () => {
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
        ? `/userActivityAmc/viewAllActivities?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`
        : `/userActivityAmc/viewAllMyActivities?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`;
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
  }, [fetchUserActivityList, fetchUserDetails]);

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
    activity.version.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="view-users">
      <div className="heading">
        <h2>User Activity List - AMC </h2>
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
            <td onClick={() => handleSort('user')}>User</td>
            <td onClick={() => handleSort('action')}>Action</td>
            <td onClick={() => handleSort('version')}>Version</td>
            <td onClick={() => handleSort('beforeFile')}>Before File</td>
            <td onClick={() => handleSort('afterFile')}>After File</td>
            <td onClick={() => handleSort('dateTime')}>Timestamp</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredUserActivityList.length > 0 ? (
            filteredUserActivityList.map((activity, index) => (
              <tr key={activity.id || index}>
                <td>{index + 1 + page * size}</td>
                <td>{activity.user}</td>
                <td>{activity.action}</td>
                <td>{activity.version}</td>
                <td>
                  {user && user.viewPermission ? (
                   <a href={activity.beforeFile} target="_blank" rel="noopener noreferrer">
                      <img src={csv} alt="csv file" className="tbl-user" />
                    </a>
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
                   <a href={activity.afterFile} target="_blank" rel="noopener noreferrer">
                      <img src={csv} alt="csv file" className="tbl-user" />
                    </a>
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
                <td>{new Date(activity.dateTime).toLocaleString()}</td>
                <td>
                  <button 
                    onClick={() => handleView(activity.id)} 
                    className="btn-view"
                    style={{ width: '60px' }}
                  >
                    View
                  </button>
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

      {showViewForm && <ViewAmcUserActivityForm id={currentActivityId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewAmcUserActivity;
