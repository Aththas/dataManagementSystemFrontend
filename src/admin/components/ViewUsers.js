import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import './ViewUser.css';
import AddUserForm from './AddUserForm';
import UpdateUserForm from './UpdateUserForm';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheckCircle, faTimesCircle, faUserCheck, faUserTimes} from '@fortawesome/free-solid-svg-icons';

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
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/user/viewUsers?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`);
      setUsers(response.data.data || []); // Ensure users is always an array
      if(response.data.data === null){
        setTotalPages(1);
      }else{
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

  const handleEnablePermission = async (userId) => {
    try {
      const response = await axiosInstance.put(`/user/enableCsvPermission?id=${userId}`);
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

  const handleDisablePermission = async (userId) => {
    try {
      const response = await axiosInstance.put(`/user/disableCsvPermission?id=${userId}`);
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

  const handleToggleViewPermission = async (user) => {
    if (user.viewPermission) {
      handleDisablePermission(user.id);
    } else {
      handleEnablePermission(user.id);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.firstname.toLowerCase().includes(searchQuery) ||
    user.lastname.toLowerCase().includes(searchQuery) ||
    user.email.toLowerCase().includes(searchQuery) ||
    user.role.toLowerCase().includes(searchQuery)
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
            <td onClick={() => handleSort('firstname')}>First Name</td>
            <td onClick={() => handleSort('lastname')}>Last Name</td>
            <td onClick={() => handleSort('email')}>Email</td>
            <td onClick={() => handleSort('role')}>Role</td>
            <td>Edit</td>
            <td>Status</td>
            <td onClick={() => handleSort('viewPermission')}>CSV Access</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.id}> {/* Use a unique key based on user.id */}
                <td>{index + 1 + page * size}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(user.id)} style={{color:"#4CAF50", cursor:'pointer'}}/>
                </td>
                <td>
                  {user.role !== "ADMIN" ? (
                    <>
                        {user.email.endsWith('null') 
                        ? <FontAwesomeIcon icon={faTimesCircle} onClick={() => handleToggleEnableDisable(user)} style={{color:"#F44336", cursor:'pointer'}}/>
                        : <FontAwesomeIcon icon={faCheckCircle} onClick={() => handleToggleEnableDisable(user)} style={{color:"#4CAF50", cursor:'pointer'}}/>}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} style={{color:"#4CAF50", cursor:'pointer'}}/>
                    </>
                  )}
                </td>
                <td>
                  {user.role !== "ADMIN" ? (
                    <>
                        {user.viewPermission 
                        ? <FontAwesomeIcon icon={faUserCheck} onClick={() => handleToggleViewPermission(user)} style={{color:"#4CAF50", cursor:'pointer'}}/> 
                        : <FontAwesomeIcon icon={faUserTimes} onClick={() => handleToggleViewPermission(user)} style={{color:"#F44336", cursor:'pointer'}}/>}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserCheck} style={{color:"#4CAF50", cursor:'pointer'}}/>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No Users found</td>
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

      {/* Conditionally render AddUserForm and UpdateUserForm */}
      {showAddForm && <AddUserForm onClose={handleCloseForm} />}
      {showUpdateForm && <UpdateUserForm id={currentUserId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewUsers;
