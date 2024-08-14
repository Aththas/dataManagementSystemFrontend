import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/popupForm.css';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path to your LoadingSpinner component

const ViewAmcForm = ({ id, onClose }) => {
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
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchAmcDetails = async () => {
      try {
        setLoading(true); // Show spinner while fetching data
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
      } finally {
        setLoading(false); // Hide spinner after fetching data
      }
    };

    fetchAmcDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>View AMC</h2>
        {loading ? (
          <LoadingSpinner /> // Show spinner while loading
        ) : (
          <form className='form'>
            <label className='label'>
              User Division:
              <input
                type="text"
                value={userDivision}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Contract Name:
              <input
                type="text"
                value={contractName}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Existing Partner:
              <input
                type="text"
                value={existingPartner}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Initial Cost (USD):
              <input
                type="number"
                value={initialCostUSD}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Initial Cost (LKR):
              <input
                type="number"
                value={initialCostLKR}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Start Date:
              <input
                type="date"
                value={startDate}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              End Date:
              <input
                type="date"
                value={endDate}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              AMC Value (USD):
              <input
                type="number"
                value={amcValueUSD}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              AMC Value (LKR):
              <input
                type="number"
                value={amcValueLKR}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              AMC Percentage Upon Purchase Price:
              <input
                type="number"
                value={amcPercentageUponPurchasePrice}
                readOnly
                className='input'
              />
            </label>
            <label className='label'>
              Category:
              <select
                value={category}
                readOnly
                className='input'
              >
                <option value="" disabled>Select Category</option>
                <option value="L">L</option>
                <option value="C">P</option>
                <option value="H">H</option>
              </select>
            </label>
            <button type="button" className='button' onClick={onClose}>Close</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ViewAmcForm;
