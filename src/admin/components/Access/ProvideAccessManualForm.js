import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../tokenValidation/axiosInstance';
import '../ViewUser.css';
import Swal from 'sweetalert2';
import AddUsersToGroup from './AddUsersToGroup';

const ProvideAccessManualForm = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/grp/getAllMyGrpUsers?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`);
      setUsers(response.data.data || []); // Ensure users is always an array
      if(response.data.data === null){
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil((response.data.message || 0) / size));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Ensure users is an empty array on error
    }
  }, [page, size, sortBy, ascending]);

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

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  const handleRemoveUser = async (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/grp/removeFromGrp?id=${userId}`);
          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Removed!',
              text: response.data.message,
            });
            fetchUsers();
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
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="view-users">
      <div className="heading">
        <h2>Users List</h2>
      </div>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
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
        <button onClick={() => setShowAddForm(true)} className="btn">Add New User</button>
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td onClick={() => handleSort('email')}>Email</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.userId}> {/* Use a unique key based on user.id */}
                <td>{index + 1 + page * size}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleRemoveUser(user.userId)} className="btn-disabled">Remove</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No Users found</td>
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
      {showAddForm && <AddUsersToGroup onClose={handleCloseForm} />}
    </div>
  );
};

export default ProvideAccessManualForm;
