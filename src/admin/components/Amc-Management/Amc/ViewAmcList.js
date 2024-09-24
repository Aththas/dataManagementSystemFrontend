import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/ViewUser.css';
import AddAmcForm from './AddAmcForm';
import UpdateAmcForm from './UpdateAmcForm';
import ViewAmcForm from './ViewAmcForm';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash, faRedo, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import pdf from './img/pdf-logo.png';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const ViewAmcList = () => {
  const [amcList, setAmcList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [currentAmcId, setCurrentAmcId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);

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

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/auth/user-info');
      if (response.data.success) {
        setCurrentUser(response.data.data);
      } else {
        toastr.error(response.data.message, '');
      }
    } catch (error) {
      toastr.error('An unexpected error occurred. Please try again later.', '');
    }
  }, []);

  const fetchAmcList = useCallback(async () => {
    try {
      const endpoint = filter === 'all'
        ? `/amc/viewAllAmcList?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`
        : `/amc/viewAllMyAmcList?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`;
      const response = await axiosInstance.get(endpoint);
      // Safeguard against response.data.data being null
      setAmcList(response.data.data || []);
      if(response.data.data === null){
        setTotalPages(1);
      }else{
        setTotalPages(Math.ceil((response.data.message || 0) / size));
      }
    } catch (error) {
      setAmcList([]); // Set to empty array on error
    }
  }, [page, size, sortBy, ascending, filter]);

  useEffect(() => {
    fetchCurrentUser();
    fetchAmcList();
  }, [fetchCurrentUser, fetchAmcList]);

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

  const handleEdit = (amcId) => {
    console.log("handleedit ", amcId);
    setCurrentAmcId(amcId);
    setShowUpdateForm(true);
  };

  const handleView = (amcId) => {
    setCurrentAmcId(amcId);
    setShowViewForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setShowViewForm(false);
    setCurrentAmcId(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleDelete = (amcId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(`/amc/deleteMyAmc?id=${amcId}`);
          if (response.data.success) {
            toastr.success(response.data.message, '');
            fetchAmcList();
          } else {
            toastr.error(response.data.message, '');
          }
        } catch (error) {
          toastr.error('An unexpected error occurred. Please try again later.', '');
        }
      }
    });
  };

  const handleAcknowledge = (amcId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, acknowledged it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.put(`/amc/acknowledge?id=${amcId}`);
          if (response.data.success) {
            toastr.success(response.data.message, '');
            fetchAmcList();
          } else {
            toastr.error(response.data.message, '');
          }
        } catch (error) {
          toastr.error('An unexpected error occurred. Please try again later.', '');
        }
      }
    });
  };

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
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error('Error downloading file:', error);
        toastr.error('Error downloading file', '');
    } 
};

  const filteredAmcList = amcList.filter(amc =>
    amc.contractName.toLowerCase().includes(searchQuery) ||
    amc.userDivision.toLowerCase().includes(searchQuery) ||
    amc.category.toLowerCase().includes(searchQuery) ||
    amc.user.toLowerCase().includes(searchQuery) ||
    new Date(amc.startDate).toLocaleDateString().toLowerCase().includes(searchQuery) ||
    new Date(amc.endDate).toLocaleDateString().toLowerCase().includes(searchQuery)
  );

  return (
    <div className="view-users">
      <div className="heading">
        <h2>AMC List</h2>
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
        <button onClick={() => setShowAddForm(true)} className="btn">Add New AMC</button>
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
              <option value="all">All AMC</option>
              <option value="my">My AMC</option>
            </select>
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td onClick={() => handleSort('contractName')}>Contract Name</td>
            <td onClick={() => handleSort('userDivision')}>User Division</td>
            <td onClick={() => handleSort('startDate')}>Start Date</td>
            <td onClick={() => handleSort('endDate')}>End Date</td>
            <td onClick={() => handleSort('category')}>Category</td>
            <td>AMC File</td>
            <td onClick={() => handleSort('user')}>User</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredAmcList.length > 0 ? (
            filteredAmcList.map((amc, index) => (
            <tr key={amc.id}>
              <td>{index + 1 + page * size}</td>
              <td>{amc.contractName}</td>
              <td>{amc.userDivision}</td>
              <td>{new Date(amc.startDate).toLocaleDateString()}</td>
              <td>{new Date(amc.endDate).toLocaleDateString()}</td>
              <td>{amc.category}</td>
              <td>
                  <img src={pdf} alt="pdf file" className="tbl-user" onClick={() => handleFile(amc.amcFile)} style={{cursor:'pointer'}}/>
              </td>
              <td>{amc.user}</td>
              <td>
                  <FontAwesomeIcon icon={faEye} onClick={() => handleView(amc.id)} style={{color:"#2196F3", backgroundColor: 'transparent', cursor:'pointer'}}/>
                {currentUser && amc.user === currentUser.email && (
                  <>
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(amc.id)} style={{color:"#4CAF50", cursor:'pointer', marginLeft:'10px'}}/>
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(amc.id)} style={{color:"#F44336", cursor:'pointer', marginLeft:'10px'}}/>
                    {amc.firstEmailSent && !amc.acknowledged && (
                      <FontAwesomeIcon icon={faRedo} onClick={() => handleAcknowledge(amc.id)} style={{ color: "#F7A000", cursor: 'pointer', marginLeft:'30px' }}/>
                    )}
                  </>
                )}
                {amc.firstEmailSent && amc.acknowledged && (
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#4CAF50", marginLeft:'30px' }}/>
                )}
              </td>              
            </tr>
          ))
        ):(
          <tr>
            <td colSpan="9">No Details found</td>
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
      {/* Conditionally render AddAmcForm, UpdateAmcForm, ViewAmcForm, and Delete confirmation dialog */}
      {showAddForm && <AddAmcForm onClose={handleCloseForm} />}
      {showUpdateForm && <UpdateAmcForm id={currentAmcId} onClose={handleCloseForm} />}
      {showViewForm && <ViewAmcForm id={currentAmcId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewAmcList;
