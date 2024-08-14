import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/ViewUser.css';
import SendRequest from './SendRequest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const AccessRequestForm = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    try {
      const endpoint = filter === 'all'
        ? `/grp/viewMyAccessGrps?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`
        : `/grp/viewAccessRequest-Requester?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`;
      const response = await axiosInstance.get(endpoint);
      console.log(response);
      setUsers(response.data.data || []); // Ensure users is always an array
      if (response.data.success !== null) {
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil((response.data.message || 0) / size));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Ensure users is an empty array on error
    }
  }, [page, size, sortBy, ascending, filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field) => {
    setSortBy(field);
    setAscending(!ascending);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value)); // Ensure size is a number
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(
    filter === 'all'
      ? (user) => user.userGroups?.toLowerCase().includes(searchQuery)
      : (user) => user.grpName?.toLowerCase().includes(searchQuery) ||
                  user.reason?.toLowerCase().includes(searchQuery) ||
                  user.status?.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="view-users">
      <div className="heading">
        <h2>My Access Groups</h2>
      </div>
      <div className="heading">
        <div className="pagination">
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
        <div className="pagination">
          <button onClick={() => setShowAddForm(true)} className="btn">Request an Access</button>
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
              <option value="all">My Access</option>
              <option value="my">My Request</option>
            </select>
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            {filter === 'all' ? (
              <td>User Group</td>
            ) : (
              <>
                <td>Reason</td>
                <td>User Group</td>
                <td>Status</td>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id}> {/* Use a unique key based on user.id */}
                <td>{index + 1 + page * size}</td>
                {filter === 'all' ? (
                  <td>{user.userGroups}</td>
                ) : (
                  <>
                    <td>{user.reason}</td>
                    <td>{user.grpName}</td>
                    <td><FontAwesomeIcon icon={faClock} style={{color:"#FFC107"}}/></td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={filter === 'all' ? 2 : 4}>No Requests found</td>
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

      {/* Conditionally render AddUserForm */}
      {showAddForm && <SendRequest onClose={handleCloseForm} />}
    </div>
  );
};

export default AccessRequestForm;
