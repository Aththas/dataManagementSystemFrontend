import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path
import '../../style/popupForm.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const UpdatePoForm = ({ id, onClose }) => {
  const [poNumber, setPoNumber] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [poCreationDate, setPoCreationDate] = useState('');
  const [poType, setPoType] = useState('');
  const [vendorName, setVendorName] = useState('');
  //const [vendorSiteCode, setVendorSiteCode] = useState('');
  const [poDescription, setPoDescription] = useState('');
  //const [approvalStatus, setApprovalStatus] = useState('');
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [matchedAmount, setMatchedAmount] = useState('');
  //const [buyerName, setBuyerName] = useState('');
  //const [closureStatus, setClosureStatus] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [prCreationDate, setPrCreationDate] = useState('');
  //const [requisitionHeaderId, setRequisitionHeaderId] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmpNum, setRequesterEmpNum] = useState('');
  //const [lineNum, setLineNum] = useState('');
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
  const [loading, setLoading] = useState(false); // Add loading state

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

  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchPoDetails = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axiosInstance.get(`/po/viewPo?id=${id}`);
        if (response.data.success) {
          const po = response.data.data;
          setPoNumber(po.poNumber);
          setCreationDate(po.creationDate ? addOneDay(po.creationDate) : '');
          setPoCreationDate(po.poCreationDate ? addOneDay(po.poCreationDate) : '');
          setPoType(po.poType);
          setVendorName(po.vendorName);
          //setVendorSiteCode(po.vendorSiteCode);
          setPoDescription(po.poDescription);
          //setApprovalStatus(po.approvalStatus);
          setCurrency(po.currency);
          setAmount(po.amount);
          setMatchedAmount(po.matchedAmount);
          //setBuyerName(po.buyerName);
          //setClosureStatus(po.closureStatus);
          setPrNumber(po.prNumber);
          setPrCreationDate(po.prCreationDate ? addOneDay(po.prCreationDate) : '');
          //setRequisitionHeaderId(po.requisitionHeaderId);
          setRequesterName(po.requesterName);
          setRequesterEmpNum(po.requesterEmpNum);
          //setLineNum(po.lineNum);
          setItemCode(po.itemCode);
          setItemDescription(po.itemDescription);
          setLineItemDescription(po.lineItemDescription);
          setUnit(po.unit);
          setUnitPrice(po.unitPrice);
          setQuantity(po.quantity);
          setLineAmount(po.lineAmount);
          setBudgetAccount(po.budgetAccount);
          setSegment6Desc(po.segment6Desc);
          setPurchaseDeliverToPersonId(po.purchaseDeliverToPersonId);
          setPurchasePoDate(po.purchasePoDate ? addOneDay(po.purchasePoDate) : '');
          setDepartment(po.department);
        } else {
          toastr.error(response.data.message, '');
        }
      } catch (error) {
        toastr.error('An unexpected error occurred. Please try again later.', '');
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchPoDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

    const vendorSiteCode = "no"; const approvalStatus = "no"; const buyerName = "no";
    const closureStatus = "no"; const requisitionHeaderId = 0; const lineNum = 0;

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
      const response = await axiosInstance.put(`/po/updateMyPo?id=${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toastr.success(response.data.message, '');
        setTimeout(() => {
          window.location.href = '/mobiDM/view-poList';
        }, 2000);
      } else {
        toastr.error(response.data.message, '');
      }
    } catch (error) {
      toastr.error('An unexpected error occurred. Please try again later.', '');
    } finally {
      setLoading(false); // End loading
      onClose(); // Close the popup form
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content-po">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>Update PO</h2>
        {loading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className='form'>
            <div className='row'>
              <label className="label input-half">
                PO Number:
                <input
                  type="number"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                PO Creation Date:
                <input
                  type="date"
                  value={poCreationDate}
                  onChange={(e) => setPoCreationDate(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                PO Type:
                <input
                  type="text"
                  value={poType}
                  onChange={(e) => setPoType(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className='row'>
              <label className="label input-half">
                PR Number:
                <input
                  type="number"
                  value={prNumber}
                  onChange={(e) => setPrNumber(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                PR Creation Date:
                <input
                  type="date"
                  value={prCreationDate}
                  onChange={(e) => setPrCreationDate(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className='label input-half'>
                PO File:
                <input
                  type="file"
                  onChange={(e) => setPoFile(e.target.files[0])}
                  className='input'
                />
              </label>
            </div>

            <div className="row">
              <label className="label input-half">
                Currency:
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Amount:
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Department:
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className='row'>
              <label className="label input-half">
                Vendor Name:
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Requester Name:
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Requester Employee Number:
                <input
                  type="number"
                  value={requesterEmpNum}
                  onChange={(e) => setRequesterEmpNum(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className='row'>
            <label className="label input-half">
                Item Code:
                <input
                  type="text"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Unit:
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Unit Price:
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>
            
            <div className='row'>
              <label className="label input-half">
                Quantity:
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Line Amount:
                <input
                  type="number"
                  value={lineAmount}
                  onChange={(e) => setLineAmount(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Budget Account:
                <input
                  type="text"
                  value={budgetAccount}
                  onChange={(e) => setBudgetAccount(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className="row">
              <label className="label input-half">
                Purchase Deliver To Person ID:
                <input
                  type="number"
                  value={purchaseDeliverToPersonId}
                  onChange={(e) => setPurchaseDeliverToPersonId(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Purchase PO Date:
                <input
                  type="date"
                  value={purchasePoDate}
                  onChange={(e) => setPurchasePoDate(e.target.value)}
                  required
                  className="input"
                />
              </label>
              <label className="label input-half">
                Warranty:
                <input
                  type="number"
                  value={matchedAmount}
                  onChange={(e) => setMatchedAmount(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className='row'>
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
                Segment 6 Description:
                <input
                  type="text"
                  value={segment6Desc}
                  onChange={(e) => setSegment6Desc(e.target.value)}
                  required
                  className="input"
                />
              </label>
            </div>

            <div className='row'>
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
            </div>

          <button type="submit" className='button'>Update PO</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePoForm;
