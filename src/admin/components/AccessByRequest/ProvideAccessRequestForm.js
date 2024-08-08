import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../tokenValidation/axiosInstance';
import '../ViewUser.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../../components/LoadingSpinner';

const ProvideAccessRequestForm = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/grp/viewAccessRequest-grpOwner?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`);
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

  const handleRequest = async (id, action) => {
    const actionText = action === 'accept' ? 'accept' : 'reject';
    const url = action === 'accept'
      ? `/grp/acceptAccessRequest?id=${id}`
      : `/grp/rejectAccessRequest?id=${id}`;

    Swal.fire({
      title: `Are you sure you want to ${actionText} this request?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${actionText} it!`,
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response =  action === 'accept'
                                    ? await axiosInstance.post(url)
                                    : await axiosInstance.delete(url);;
          
          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)}ed!`,
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
        }finally {
          setLoading(false);
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.grpName.toLowerCase().includes(searchQuery) ||
    user.status.toLowerCase().includes(searchQuery) ||
    user.reason.toLowerCase().includes(searchQuery) ||
    user.requesterEmail.toLowerCase().includes(searchQuery) 
  );

  return (
    <div className="view-users">
      {loading && <LoadingSpinner />}
      <div className="heading">
        <h2>Manage Access Request</h2>
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
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td>Requested User</td>
            <td>Reason</td>
            <td>Current Status</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={user.userId}> {/* Use a unique key based on user.id */}
                <td>{index + 1 + page * size}</td>
                <td>{user.requesterEmail}</td>
                <td>{user.reason}</td>
                <td>{user.status}</td>
                <td>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => handleRequest(user.id, 'accept')} style={{color:"#4CAF50", cursor:'pointer', marginRight:'20px'}}/>
                    <FontAwesomeIcon icon={faThumbsDown} onClick={() => handleRequest(user.id, 'reject')} style={{color:"#F44336", cursor:'pointer', marginLeft:'20px'}}/>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Requests found</td>
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
    </div>
  );
};

export default ProvideAccessRequestForm;
