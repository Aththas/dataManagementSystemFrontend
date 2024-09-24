import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/popupForm.css';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path to your LoadingSpinner component
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

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
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('LKR');

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

  useEffect(() => {
    const fetchAmcDetails = async () => {
      try {
        setLoading(true);
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
          if(parseInt(amc.amcValueLKR) === 0){
            setCurrency('USD');
          }
        } else {
          toastr.error(response.data.message, '');
        }
      } catch (error) {
        toastr.error('An unexpected error occurred. Please try again later.', '');
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
          <form className='form' style={{fontSize:'12px'}}>
            
            <label className='label'>
              <b>Contract Name: </b> {contractName}
            </label>

            <label className='label'>
              <b>User Division: </b> {userDivision}
            </label>
            
            <label className='label'>
              <b>Existing Partner: </b> {existingPartner}
            </label>

            <div className='row'>
              <label className='label input-half'>
                <b>Start Date: </b> {startDate}
              </label>
              <label className='label input-half'>
                <b>End Date: </b> {endDate}
              </label>
            </div>

            <div className='row'>
            {currency === 'USD' ? (
              <>
                <label className='label input-half'>
                  <b>Initial Cost (USD): </b> {initialCostUSD}
                </label>
                <label className='label input-half'>
                  <b>AMC Value (USD): </b> {amcValueUSD}
                </label>
              </>
            ) : (
              <>
                <label className='label input-half'>
                  <b>Initial Cost (LKR): </b> {initialCostLKR}
                </label>
                <label className='label input-half'>
                  < b>AMC Value (LKR): </b> {amcValueLKR}
                </label>
              </>
            )}
            </div>

            <label className='label'>
              <b>AMC Percentage Upon Purchase Price: </b> {amcPercentageUponPurchasePrice}
            </label>
            
            <label className='label'>
              <b>Category: </b> {category}
            </label>
            <button type="button" className='button' onClick={onClose}>Close</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ViewAmcForm;
