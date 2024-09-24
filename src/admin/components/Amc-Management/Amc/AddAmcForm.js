import React, { useState } from 'react';
import '../../style/popupForm.css';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path to your component
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const AddAmcForm = ({ onClose }) => {
  const [contractName, setContractName] = useState('');
  const [userDivision, setUserDivision] = useState('');
  const [existingPartner, setExistingPartner] = useState('');
  const [initialCostUSD, setInitialCostUSD] = useState('0');
  const [initialCostLKR, setInitialCostLKR] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [amcValueUSD, setAmcValueUSD] = useState('0');
  const [amcValueLKR, setAmcValueLKR] = useState('0');
  const [category, setCategory] = useState('');
  const [amcFile, setAmcFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
      toastr.error('Only PDF files are allowed', '');
      event.target.value = null; // Clear the file input
    } else {
      setAmcFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    let amcPercentageUponPurchasePrice = 0;
    if(currency === 'LKR'){
      if(parseFloat(initialCostLKR) !== 0 || initialCostLKR !== null){
        amcPercentageUponPurchasePrice = (parseFloat(initialCostLKR)/parseFloat(amcValueLKR))*100;
      }  
      setInitialCostLKR('0');
    }else{
      if(parseFloat(initialCostUSD) !== 0 || initialCostUSD !== null){
        amcPercentageUponPurchasePrice = (parseFloat(initialCostUSD)/parseFloat(amcValueUSD))*100;
      } 
      setInitialCostUSD('0');
    }
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
        toastr.success(response.data.message, '');
        setTimeout(() => {
          window.location.href = '/mobiDM/view-amcList';
        }, 2000);
      } else {
        toastr.error(response.data.message, '');
      }
    } catch (error) {
      toastr.error('An unexpected error occurred. Please try again later.', '');
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

            <div className="row">
              <label className="label input-half">
                User Division:
                <input
                  type="text"
                  value={userDivision}
                  onChange={(e) => setUserDivision(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Existing Partner:
                <input
                  type="text"
                  value={existingPartner}
                  onChange={(e) => setExistingPartner(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className="row">
              <label className="label input-half">
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>
            
            <div className="row">
              <label className="label input-half">
                Currency:
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="input"
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                </select>
              </label>

            {currency === 'USD' ? (
              <>
                <label className="label input-half">
                  Initial Cost (USD):
                  <input
                    type="number"
                    value={initialCostUSD}
                    onChange={(e) => setInitialCostUSD(e.target.value)}
                    className="input"
                  />
                </label>
                <label className="label input-half">
                  AMC Value (USD):
                  <input
                    type="number"
                    value={amcValueUSD}
                    onChange={(e) => setAmcValueUSD(e.target.value)}
                    className="input"
                  />
                </label>
                </>
            ) : (
              <>
                <label className="label input-half">
                  Initial Cost (LKR):
                  <input
                    type="number"
                    value={initialCostLKR}
                    onChange={(e) => setInitialCostLKR(e.target.value)}
                    className="input"
                  />
                </label>
                <label className="label input-half">
                  AMC Value (LKR):
                  <input
                    type="number"
                    value={amcValueLKR}
                    onChange={(e) => setAmcValueLKR(e.target.value)}
                    className="input"
                  />
                </label>
                </>
            )}
            </div>

            <div className="row">
              <label className='label input-half'>
                Category:
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className='input'
                >
                  <option value="" disabled >Select Category</option>
                  <option value="Hardware and Software Systems">Hardware and Software Systems</option>
                  <option value="License subscriptions">License subscriptions</option>
                  <option value="License Software assurnce">License Software assurnce</option>
                  <option value="Product Local Support">Product Local Support</option>
                </select>
              </label>
              <label className="label input-half">
                AMC File (PDF only):
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="input"
                />
              </label>
            </div>
            <button type="submit" className="button">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddAmcForm;
