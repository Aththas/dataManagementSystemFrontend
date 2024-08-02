import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import './ViewUser.css';
import AddUserForm from './AddUserForm';
import UpdateUserForm from './UpdateUserForm';
import Swal from 'sweetalert2';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/user/viewUsers?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`);
      setUsers(response.data.data);
      setTotalPages(Math.ceil(response.data.message / size));
    } catch (error) {
      console.error('Error fetching users:', error);
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
    setSize(event.target.value);
    setPage(0);
  };

  const handleEdit = (userId) => {
    setCurrentUserId(userId);
    setShowUpdateForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setCurrentUserId(null);
  };

  const handleEnableUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/user/enableUser?id=${userId}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
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
  };

  const handleDisableUser = async (userId) => {
    try {
      const response = await axiosInstance.put(`/user/disableUser?id=${userId}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
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
  };

  const handleToggleEnableDisable = (user) => {
    if (user.email.endsWith('null')) {
      handleEnableUser(user.id);
    } else {
      handleDisableUser(user.id);
    }
  };

  return (
    <div className="view-users">
      <div className="heading">
        <h2>Users List</h2>
        <button onClick={() => setShowAddForm(true)} className="btn">Add New User</button>
      </div>
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
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td onClick={() => handleSort('firstname')}>First Name</td>
            <td onClick={() => handleSort('lastname')}>Last Name</td>
            <td onClick={() => handleSort('email')}>Email</td>
            <td onClick={() => handleSort('role')}>Role</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1 + page * size}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user.id)} className="btn-edit"></button>
                <button
                  onClick={() => handleToggleEnableDisable(user)}
                  className={`${user.email.endsWith('null') ? 'btn-enabled' : 'btn-disabled'}`}
                >
                  {user.email.endsWith('null') ? 'Enable' : 'Disable'}
                </button>
              </td>
            </tr>
          ))}
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

      {/* Conditionally render AddUserForm and UpdateUserForm */}
      {showAddForm && <AddUserForm onClose={handleCloseForm} />}
      {showUpdateForm && <UpdateUserForm id={currentUserId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewUsers;
