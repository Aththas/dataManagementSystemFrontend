import React, { useEffect, useState,useCallback  } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import './ViewUser.css';
import { Link } from 'react-router-dom';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = useCallback (async () => {
    try {
      const response = await axiosInstance.get(`/user/viewUsers?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`);
      setUsers(response.data.data);
      setTotalPages(Math.ceil(response.data.message/size));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },[page, size, sortBy, ascending]);

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

  return (
    <div className="view-users">
      <div className="heading">
        <h2>Users List</h2>
        <Link to="/add-user"><button className="btn">Add New User</button></Link>
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
                <button className="btn-edit">Edit</button> 
                <button className={`${user.email.endsWith('null') ? 'btn-disabled' : 'btn-enabled'}`}>
                  {user.email.endsWith('null') ? 'Disabled' : 'Enabled'}
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
        <span>Page {page + 1} of {totalPages} </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewUsers;
