import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import '../styles/popupForm.css';

const UpdateAmcForm = ({ id, onClose }) => {
  const [userDivision, setUserDivision] = useState('');
  const [contractName, setContractName] = useState('');
  const [existingPartner, setExistingPartner] = useState('');
  const [initialCostUSD, setInitialCostUSD] = useState('');
  const [initialCostLKR, setInitialCostLKR] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amcValueUSD, setAmcValueUSD] = useState('');
  const [amcValueLKR, setAmcValueLKR] = useState('');
  const [amcPercentageUponPurchasePrice, setAmcPercentageUponPurchasePrice] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchAmcDetails = async () => {
      try {
        console.log("up "+ id);
        const response = await axiosInstance.get(`/amc/viewAmc?id=${id}`);
        if (response.data.success) {
          const amc = response.data.data;
          setUserDivision(amc.userDivision);
          setContractName(amc.contractName);
          setExistingPartner(amc.existingPartner);
          setInitialCostUSD(amc.initialCostUSD);
          setInitialCostLKR(amc.initialCostLKR);
          setStartDate(amc.startDate ? new Date(amc.startDate).toISOString().split('T')[0] : '');
          setEndDate(amc.endDate ? new Date(amc.endDate).toISOString().split('T')[0] : '');
          setAmcValueUSD(amc.amcValueUSD);
          setAmcValueLKR(amc.amcValueLKR);
          setAmcPercentageUponPurchasePrice(amc.amcPercentageUponPurchasePrice);
          setCategory(amc.category);
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

    fetchAmcDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axiosInstance.put(`/amc/updateMyAmc?id=${id}`, {
        userDivision,
        contractName,
        existingPartner,
        initialCostUSD,
        initialCostLKR,
        startDate,
        endDate,
        amcValueUSD,
        amcValueLKR,
        amcPercentageUponPurchasePrice,
        category,
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
          window.location.href = '/view-amcList'; // Redirect to the AMC list page after successful update
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    } finally {
      onClose(); // Close the popup form regardless of success or failure
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>Update AMC</h2>
        <form onSubmit={handleSubmit} className='form'>
          <label className='label'>
            User Division:
            <input
              type="text"
              value={userDivision}
              onChange={(e) => setUserDivision(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Contract Name:
            <input
              type="text"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Existing Partner:
            <input
              type="text"
              value={existingPartner}
              onChange={(e) => setExistingPartner(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Initial Cost (USD):
            <input
              type="number"
              value={initialCostUSD}
              onChange={(e) => setInitialCostUSD(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Initial Cost (LKR):
            <input
              type="number"
              value={initialCostLKR}
              onChange={(e) => setInitialCostLKR(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            AMC Value (USD):
            <input
              type="number"
              value={amcValueUSD}
              onChange={(e) => setAmcValueUSD(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            AMC Value (LKR):
            <input
              type="number"
              value={amcValueLKR}
              onChange={(e) => setAmcValueLKR(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            AMC Percentage Upon Purchase Price:
            <input
              type="number"
              value={amcPercentageUponPurchasePrice}
              onChange={(e) => setAmcPercentageUponPurchasePrice(e.target.value)}
              required
              className='input'
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
              <option value="C">P</option>
              <option value="H">H</option>
            </select>
          </label>
          <button type="submit" className='button'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAmcForm;
