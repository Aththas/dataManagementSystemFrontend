import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/ViewUser.css';
import AddPoForm from './AddPoForm';
import UpdatePoForm from './UpdatePoForm';
import ViewPoForm from './ViewPoForm';
import Swal from 'sweetalert2';
import pdf from './img/pdf-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faTrash} from '@fortawesome/free-solid-svg-icons';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const ViewPoList = () => {
  const [poList, setPoList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [ascending, setAscending] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [currentPoId, setCurrentPoId] = useState(null);
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
        console.error('Error fetching user details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }, []);

  const fetchPoList = useCallback(async () => {
    try {
      const endpoint = filter === 'all'
        ? `/po/viewAllPoList?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`
        : `/po/viewAllMyPoList?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`;
      const response = await axiosInstance.get(endpoint);
      setPoList(response.data.data || []);
      if(response.data.data === null){
        setTotalPages(1);
      }else{
        setTotalPages(Math.ceil((response.data.message || 0) / size));
      }
    } catch (error) {
      console.error('Error fetching PO list:', error);
      setPoList([]); // Set to empty array on error
    }
  }, [page, size, sortBy, ascending, filter]);

  useEffect(() => {
    fetchCurrentUser();
    fetchPoList();
  }, [fetchCurrentUser, fetchPoList]);

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

  const handleEdit = (poId) => {
    console.log("handleedit ", poId);
    setCurrentPoId(poId);
    setShowUpdateForm(true);
  };

  const handleView = (poId) => {
    console.log("handleedit ", poId);
    setCurrentPoId(poId);
    console.log("cid " , currentPoId)
    setShowViewForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setShowUpdateForm(false);
    setShowViewForm(false);
    setCurrentPoId(null);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0);
  };

  const handleDelete = (poId) => {
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
          const response = await axiosInstance.delete(`/po/deleteMyPo?id=${poId}`);
          if (response.data.success) {
            toastr.success('The PO has been deleted', '');
            fetchPoList();
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
    } 
  };
  


  const filteredPoList = poList.filter(po =>
    po.vendorName.toLowerCase().includes(searchQuery) ||
    po.user.toLowerCase().includes(searchQuery) ||
    po.poType.toLowerCase().includes(searchQuery) ||
    po.department.toLowerCase().includes(searchQuery) ||
    po.poNumber.toString().toLowerCase().includes(searchQuery) ||
    po.prNumber.toString().toLowerCase().includes(searchQuery) ||
    new Date(po.poCreationDate).toLocaleDateString().toLowerCase().includes(searchQuery)
  );

  return (
    <div className="view-users">
      <div className="heading">
        <h2>PO List</h2>
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
        <button onClick={() => setShowAddForm(true)} className="btn">Add New PO</button>
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
              <option value="all">All PO</option>
              <option value="my">My PO</option>
            </select>
          </label>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <td onClick={() => handleSort('id')}>#</td>
            <td onClick={() => handleSort('poNumber')}>PO Number</td>
            <td onClick={() => handleSort('prNumber')}>PR Number</td>
            <td onClick={() => handleSort('poCreationDate')}>PO Creation Date</td>
            <td onClick={() => handleSort('poType')}>PO Type</td>
            <td onClick={() => handleSort('vendorName')}>Vendor Name</td>
            <td onClick={() => handleSort('department')}>Department</td>
            <td>PO File</td>
            <td onClick={() => handleSort('user')}>User</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {filteredPoList.length > 0 ? (
            filteredPoList.map((po, index) => (
            <tr key={po.id}>
              <td>{index + 1 + page * size}</td>
              <td>{po.poNumber}</td>
              <td>{po.prNumber}</td>
              <td>{new Date(po.poCreationDate).toLocaleDateString()}</td>
              <td>{po.poType}</td>
              <td>{po.vendorName}</td>
              <td>{po.department}</td>
              <td>
                  <img src={pdf} alt="pdf file" className="tbl-user" onClick={() => handleFile(po.poFile)} style={{cursor:'pointer'}}/>
              </td>
              <td>{po.user}</td>
              <td>
                  <FontAwesomeIcon icon={faEye} onClick={() => handleView(po.id)} style={{color:"#2196F3", backgroundColor: 'transparent', cursor:'pointer'}}/>
                {currentUser && po.user === currentUser.email && (
                  <>
                    <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(po.id)} style={{color:"#4CAF50", cursor:'pointer', marginLeft:'10px'}}/>
                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(po.id)} style={{color:"#F44336", cursor:'pointer', marginLeft:'10px'}}/>
                  </>
                )}
              </td>
            </tr>
          ))
        ):(
          <tr>
            <td colSpan="10">No Details found</td>
          </tr>
        )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          Previous
        </button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages - 1}>
          Next
        </button>
      </div>
      {    console.log("cid " , currentPoId)}
      {showAddForm && <AddPoForm onClose={handleCloseForm} />}
      {showUpdateForm && <UpdatePoForm id={currentPoId} onClose={handleCloseForm} />}
      {showViewForm && <ViewPoForm id={currentPoId} onClose={handleCloseForm} />}
    </div>
  );
};

export default ViewPoList;
