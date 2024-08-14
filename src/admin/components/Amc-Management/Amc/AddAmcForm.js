import React, { useState } from 'react';
import '../../style/popupForm.css';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path to your component

const AddAmcForm = ({ onClose }) => {
  const [contractName, setContractName] = useState('');
  const [userDivision, setUserDivision] = useState('');
  const [existingPartner, setExistingPartner] = useState('');
  const [initialCostUSD, setInitialCostUSD] = useState('');
  const [initialCostLKR, setInitialCostLKR] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amcValueUSD, setAmcValueUSD] = useState('');
  const [amcValueLKR, setAmcValueLKR] = useState('');
  const [amcPercentageUponPurchasePrice, setAmcPercentageUponPurchasePrice] = useState('');
  const [category, setCategory] = useState('');
  const [amcFile, setAmcFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Only PDF files are allowed.',
      });
      event.target.value = null; // Clear the file input
    } else {
      setAmcFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the request starts

    const formData = new FormData();
    formData.append('contractName', contractName);
    formData.append('userDivision', userDivision);
    formData.append('existingPartner', existingPartner);
    formData.append('initialCostUSD', initialCostUSD);
    formData.append('initialCostLKR', initialCostLKR);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('amcValueUSD', amcValueUSD);
    formData.append('amcValueLKR', amcValueLKR);
    formData.append('amcPercentageUponPurchasePrice', amcPercentageUponPurchasePrice);
    formData.append('category', category);
    if (amcFile) {
      formData.append('amcFile', amcFile);
    }

    try {
      const response = await axiosInstance.post('/amc/addAmc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
          window.location.href = '/view-amcList'; // Redirect to the AMC list page after successful submission
        });
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
    } finally {
      setLoading(false); // Set loading to false when the request completes
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className="h2">Add New AMC Contract</h2>
        {loading ? (
          <LoadingSpinner /> // Show the spinner when loading
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <label className="label">
              Contract Name:
              <input
                type="text"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              User Division:
              <input
                type="text"
                value={userDivision}
                onChange={(e) => setUserDivision(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Existing Partner:
              <input
                type="text"
                value={existingPartner}
                onChange={(e) => setExistingPartner(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Initial Cost (USD):
              <input
                type="number"
                value={initialCostUSD}
                onChange={(e) => setInitialCostUSD(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Initial Cost (LKR):
              <input
                type="number"
                value={initialCostLKR}
                onChange={(e) => setInitialCostLKR(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              AMC Value (USD):
              <input
                type="number"
                value={amcValueUSD}
                onChange={(e) => setAmcValueUSD(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              AMC Value (LKR):
              <input
                type="number"
                value={amcValueLKR}
                onChange={(e) => setAmcValueLKR(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              AMC Percentage Upon Purchase Price:
              <input
                type="number"
                value={amcPercentageUponPurchasePrice}
                onChange={(e) => setAmcPercentageUponPurchasePrice(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className='label'>
              Category:
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className='input'
              >
                <option value="" disabled >Select Category</option>
                <option value="L">L</option>
                <option value="P">P</option>
                <option value="H">H</option>
              </select>
            </label>
            <label className="label">
              AMC File (PDF only):
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="input"
              />
            </label>
            <button type="submit" className="button">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAmcForm;
