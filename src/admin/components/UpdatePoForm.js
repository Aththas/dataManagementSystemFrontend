import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../components/LoadingSpinner'; // Ensure correct path
import '../styles/popupForm.css';

const UpdatePoForm = ({ id, onClose }) => {
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
  const [loading, setLoading] = useState(false); // Add loading state

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
          setVendorSiteCode(po.vendorSiteCode);
          setPoDescription(po.poDescription);
          setApprovalStatus(po.approvalStatus);
          setCurrency(po.currency);
          setAmount(po.amount);
          setMatchedAmount(po.matchedAmount);
          setBuyerName(po.buyerName);
          setClosureStatus(po.closureStatus);
          setPrNumber(po.prNumber);
          setPrCreationDate(po.prCreationDate ? addOneDay(po.prCreationDate) : '');
          setRequisitionHeaderId(po.requisitionHeaderId);
          setRequesterName(po.requesterName);
          setRequesterEmpNum(po.requesterEmpNum);
          setLineNum(po.lineNum);
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
        setLoading(false); // End loading
      }
    };

    fetchPoDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading

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
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.data.message,
        }).then(() => {
          window.location.href = '/view-poList'; // Redirect after successful update
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
      setLoading(false); // End loading
      onClose(); // Close the popup form
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>Update PO</h2>
        {loading && <LoadingSpinner />}
        <form onSubmit={handleSubmit} className='form'>
          <label className='label'>
            PO Number:
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Creation Date:
            <input
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PO Creation Date:
            <input
              type="date"
              value={poCreationDate}
              onChange={(e) => setPoCreationDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PO Type:
            <input
              type="text"
              value={poType}
              onChange={(e) => setPoType(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Vendor Name:
            <input
              type="text"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Vendor Site Code:
            <input
              type="text"
              value={vendorSiteCode}
              onChange={(e) => setVendorSiteCode(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PO Description:
            <input
              type="text"
              value={poDescription}
              onChange={(e) => setPoDescription(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Approval Status:
            <input
              type="text"
              value={approvalStatus}
              onChange={(e) => setApprovalStatus(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Currency:
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Matched Amount:
            <input
              type="number"
              value={matchedAmount}
              onChange={(e) => setMatchedAmount(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Buyer Name:
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Closure Status:
            <input
              type="text"
              value={closureStatus}
              onChange={(e) => setClosureStatus(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PR Number:
            <input
              type="text"
              value={prNumber}
              onChange={(e) => setPrNumber(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PR Creation Date:
            <input
              type="date"
              value={prCreationDate}
              onChange={(e) => setPrCreationDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Requisition Header ID:
            <input
              type="text"
              value={requisitionHeaderId}
              onChange={(e) => setRequisitionHeaderId(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Requester Name:
            <input
              type="text"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Requester Emp Num:
            <input
              type="text"
              value={requesterEmpNum}
              onChange={(e) => setRequesterEmpNum(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Line Num:
            <input
              type="text"
              value={lineNum}
              onChange={(e) => setLineNum(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Item Code:
            <input
              type="text"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Item Description:
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Line Item Description:
            <input
              type="text"
              value={lineItemDescription}
              onChange={(e) => setLineItemDescription(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Unit:
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Unit Price:
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Line Amount:
            <input
              type="number"
              value={lineAmount}
              onChange={(e) => setLineAmount(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Budget Account:
            <input
              type="text"
              value={budgetAccount}
              onChange={(e) => setBudgetAccount(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Segment 6 Desc:
            <input
              type="text"
              value={segment6Desc}
              onChange={(e) => setSegment6Desc(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Purchase Deliver To Person ID:
            <input
              type="text"
              value={purchaseDeliverToPersonId}
              onChange={(e) => setPurchaseDeliverToPersonId(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Purchase PO Date:
            <input
              type="date"
              value={purchasePoDate}
              onChange={(e) => setPurchasePoDate(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            Department:
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className='input'
            />
          </label>
          <label className='label'>
            PO File:
            <input
              type="file"
              onChange={(e) => setPoFile(e.target.files[0])}
              className='input'
            />
          </label>
          <button type="submit" className='button'>Update PO</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePoForm;
