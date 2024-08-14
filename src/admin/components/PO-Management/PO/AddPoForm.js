import React, { useState } from 'react';
import '../../style/popupForm.css';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path to your LoadingSpinner component

const AddPoForm = ({ onClose }) => {
  const [poNumber, setPoNumber] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [poCreationDate, setPoCreationDate] = useState('');
  const [poType, setPoType] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorSiteCode, setVendorSiteCode] = useState('');
  const [poDescription, setPoDescription] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [matchedAmount, setMatchedAmount] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [closureStatus, setClosureStatus] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [prCreationDate, setPrCreationDate] = useState('');
  const [requisitionHeaderId, setRequisitionHeaderId] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmpNum, setRequesterEmpNum] = useState('');
  const [lineNum, setLineNum] = useState('');
  const [itemCode, setItemCode] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [lineItemDescription, setLineItemDescription] = useState('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [lineAmount, setLineAmount] = useState('');
  const [budgetAccount, setBudgetAccount] = useState('');
  const [segment6Desc, setSegment6Desc] = useState('');
  const [purchaseDeliverToPersonId, setPurchaseDeliverToPersonId] = useState('');
  const [purchasePoDate, setPurchasePoDate] = useState('');
  const [department, setDepartment] = useState('');
  const [poFile, setPoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
      setPoFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true

    const formData = new FormData();
    formData.append('poNumber', poNumber);
    formData.append('creationDate', creationDate);
    formData.append('poCreationDate', poCreationDate);
    formData.append('poType', poType);
    formData.append('vendorName', vendorName);
    formData.append('vendorSiteCode', vendorSiteCode);
    formData.append('poDescription', poDescription);
    formData.append('approvalStatus', approvalStatus);
    formData.append('currency', currency);
    formData.append('amount', amount);
    formData.append('matchedAmount', matchedAmount);
    formData.append('buyerName', buyerName);
    formData.append('closureStatus', closureStatus);
    formData.append('prNumber', prNumber);
    formData.append('prCreationDate', prCreationDate);
    formData.append('requisitionHeaderId', requisitionHeaderId);
    formData.append('requesterName', requesterName);
    formData.append('requesterEmpNum', requesterEmpNum);
    formData.append('lineNum', lineNum);
    formData.append('itemCode', itemCode);
    formData.append('itemDescription', itemDescription);
    formData.append('lineItemDescription', lineItemDescription);
    formData.append('unit', unit);
    formData.append('unitPrice', unitPrice);
    formData.append('quantity', quantity);
    formData.append('lineAmount', lineAmount);
    formData.append('budgetAccount', budgetAccount);
    formData.append('segment6Desc', segment6Desc);
    formData.append('purchaseDeliverToPersonId', purchaseDeliverToPersonId);
    formData.append('purchasePoDate', purchasePoDate);
    formData.append('department', department);
    if (poFile) {
      formData.append('poFile', poFile);
    }

    try {
      const response = await axiosInstance.post('/po/addPo', formData, {
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
          window.location.href = '/view-poList'; // Redirect to the PO list page after successful submission
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
      setIsLoading(false); // Set loading state to false
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className="h2">Add New PO</h2>
        {isLoading ? (
          <LoadingSpinner /> // Show the loading spinner
        ) : (
          <form onSubmit={handleSubmit} className="form">
            {/* Form fields */}
            <label className="label">
              PO Number:
              <input
                type="number"
                value={poNumber}
                onChange={(e) => setPoNumber(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Creation Date:
              <input
                type="date"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PO Creation Date:
              <input
                type="date"
                value={poCreationDate}
                onChange={(e) => setPoCreationDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PO Type:
              <input
                type="text"
                value={poType}
                onChange={(e) => setPoType(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Vendor Name:
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Vendor Site Code:
              <input
                type="text"
                value={vendorSiteCode}
                onChange={(e) => setVendorSiteCode(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PO Description:
              <input
                type="text"
                value={poDescription}
                onChange={(e) => setPoDescription(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Approval Status:
              <input
                type="text"
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Currency:
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Matched Amount:
              <input
                type="number"
                value={matchedAmount}
                onChange={(e) => setMatchedAmount(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Buyer Name:
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Closure Status:
              <input
                type="text"
                value={closureStatus}
                onChange={(e) => setClosureStatus(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PR Number:
              <input
                type="number"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PR Creation Date:
              <input
                type="date"
                value={prCreationDate}
                onChange={(e) => setPrCreationDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Requisition Header ID:
              <input
                type="number"
                value={requisitionHeaderId}
                onChange={(e) => setRequisitionHeaderId(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Requester Name:
              <input
                type="text"
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Requester Employee Number:
              <input
                type="number"
                value={requesterEmpNum}
                onChange={(e) => setRequesterEmpNum(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Line Number:
              <input
                type="number"
                value={lineNum}
                onChange={(e) => setLineNum(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Item Code:
              <input
                type="text"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Item Description:
              <input
                type="text"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Line Item Description:
              <input
                type="text"
                value={lineItemDescription}
                onChange={(e) => setLineItemDescription(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Unit:
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Unit Price:
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Quantity:
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Line Amount:
              <input
                type="number"
                value={lineAmount}
                onChange={(e) => setLineAmount(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Budget Account:
              <input
                type="text"
                value={budgetAccount}
                onChange={(e) => setBudgetAccount(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Segment 6 Description:
              <input
                type="text"
                value={segment6Desc}
                onChange={(e) => setSegment6Desc(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Purchase Deliver To Person ID:
              <input
                type="number"
                value={purchaseDeliverToPersonId}
                onChange={(e) => setPurchaseDeliverToPersonId(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Purchase PO Date:
              <input
                type="date"
                value={purchasePoDate}
                onChange={(e) => setPurchasePoDate(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              Department:
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="input"
              />
            </label>
            <label className="label">
              PO File (PDF only):
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

export default AddPoForm;
