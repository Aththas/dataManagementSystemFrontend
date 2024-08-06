import React, { useState, useEffect } from 'react';
import axiosInstance from '../tokenValidation/axiosInstance';
import Swal from 'sweetalert2';
import '../styles/popupForm.css';
import LoadingSpinner from '../../components/LoadingSpinner'; // Ensure correct path

const ViewPoForm = ({ id, onClose }) => {
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
  const [loading, setLoading] = useState(true); // Add loading state

  const addOneDay = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0]; // Return date in 'yyyy-MM-dd' format
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
        setLoading(false); // Stop loading
      }
    };

    fetchPoDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
      {loading ? ( // Show spinner if loading
          <LoadingSpinner />
        ) : (
          <>
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>View PO</h2>
        <form className='form'>
          <label className='label'>
            PO Number:
            <input
              type="text"
              value={poNumber}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Creation Date:
            <input
              type="date"
              value={creationDate}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            PO Creation Date:
            <input
              type="date"
              value={poCreationDate}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            PO Type:
            <input
              type="text"
              value={poType}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Vendor Name:
            <input
              type="text"
              value={vendorName}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Vendor Site Code:
            <input
              type="text"
              value={vendorSiteCode}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            PO Description:
            <input
              type="text"
              value={poDescription}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Approval Status:
            <input
              type="text"
              value={approvalStatus}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Currency:
            <input
              type="text"
              value={currency}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Amount:
            <input
              type="number"
              value={amount}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Matched Amount:
            <input
              type="number"
              value={matchedAmount}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Buyer Name:
            <input
              type="text"
              value={buyerName}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Closure Status:
            <input
              type="text"
              value={closureStatus}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            PR Number:
            <input
              type="text"
              value={prNumber}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            PR Creation Date:
            <input
              type="date"
              value={prCreationDate}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Requisition Header ID:
            <input
              type="text"
              value={requisitionHeaderId}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Requester Name:
            <input
              type="text"
              value={requesterName}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Requester Emp Num:
            <input
              type="text"
              value={requesterEmpNum}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Line Num:
            <input
              type="text"
              value={lineNum}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Item Code:
            <input
              type="text"
              value={itemCode}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Item Description:
            <input
              type="text"
              value={itemDescription}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Line Item Description:
            <input
              type="text"
              value={lineItemDescription}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Unit:
            <input
              type="text"
              value={unit}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Unit Price:
            <input
              type="number"
              value={unitPrice}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Quantity:
            <input
              type="number"
              value={quantity}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Line Amount:
            <input
              type="number"
              value={lineAmount}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Budget Account:
            <input
              type="text"
              value={budgetAccount}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Segment 6 Desc:
            <input
              type="text"
              value={segment6Desc}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Purchase Deliver To Person ID:
            <input
              type="text"
              value={purchaseDeliverToPersonId}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Purchase PO Date:
            <input
              type="date"
              value={purchasePoDate}
              readOnly
              className='input'
            />
          </label>
          <label className='label'>
            Department:
            <input
              type="text"
              value={department}
              readOnly
              className='input'
            />
          </label>
          <button type="button" className='button' onClick={onClose}>Close</button>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default ViewPoForm;
