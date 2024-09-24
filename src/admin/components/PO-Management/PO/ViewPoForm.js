import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../tokenValidation/axiosInstance';
import '../../style/popupForm.css';
import LoadingSpinner from '../../../../components/loading/LoadingSpinner'; // Ensure correct path
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import '../../style/toastr.css';

const ViewPoForm = ({ id, onClose }) => {
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
  const [loading, setLoading] = useState(true); // Add loading state

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
        setLoading(false); // Stop loading
      }
    };

    fetchPoDetails();
  }, [id]);

  return (
    <div className="popup-overlay">
      <div className="popup-content-po">
      {loading ? ( 
          <LoadingSpinner />
        ) : (
          <>
        <button className="popup-close" onClick={onClose}>×</button>
        <h2 className='h2'>View PO</h2>
        <form className='form' style={{fontSize:'12px'}}>
          <div className='row'>
            <label className='label input-half'>
              <b>PO Number: </b> {poNumber}
            </label>
            <label className='label input-half'>
              <b>PO Creation Date: </b> {poCreationDate}
            </label>
            <label className='label input-half'>
              <b>Creation Date: </b> {creationDate}
            </label>
          </div>

          <div className="row">
            <label className='label input-half'>
              <b>PR Number: </b> {prNumber}
            </label>
            <label className='label input-half'>
              <b>PR Creation Date: </b> {prCreationDate}
            </label>
            <label className='label input-half'>
              <b>PO Type: </b> {poType}
            </label>
          </div>

          <div className='row'>
            <label className='label input-half'>
              <b>Currency: </b> {currency}
            </label>
            <label className='label input-half'>
              <b>Amount: </b> {amount}
            </label>
            <label className='label input-half'>
              <b>Department: </b> {department}
            </label>
          </div>

          <div className='row'>
            <label className='label input-half'>
              <b>Vendor Name: </b> {vendorName}
            </label>
            <label className='label input-half'>
              <b>Requester Name: </b> {requesterName}
            </label>
            <label className='label input-half'>
              <b>Requester Employee Number: </b> {requesterEmpNum}
            </label>
          </div>

          <div className='row'>
            <label className='label input-half'>
              <b>Item Code: </b> {itemCode}
            </label>
            <label className='label input-half'>
              <b>Unit: </b> {unit}
            </label>
            <label className='label input-half'>
              <b>Unit Price: </b> {unitPrice}
            </label>
          </div>

          <div className='row'>
            <label className='label input-half'>
              <b>Quantity: </b> {quantity}
            </label>
            <label className='label input-half'>
              <b>Line Amount: </b> {lineAmount}
            </label>
            <label className='label input-half'>
              <b>Budget Account: </b> {budgetAccount}
            </label>
          </div>

          <div className='row'>
            <label className='label input-half'>
              <b>Purchase Deliver To Person ID: </b> {purchaseDeliverToPersonId}
            </label>
            <label className='label input-half'>
              <b>Purchase PO Date: </b> {purchasePoDate}
            </label>
            <label className='label input-half'>
              <b>Warranty: </b> {matchedAmount}
            </label>
          </div>

          <label className='label'>
            <b>Item Description: </b> {itemDescription}
          </label>

          <label className='label'>
            <b>Line Item Description: </b> {lineItemDescription}
          </label>

          <label className='label input-half'>
            <b>PO Description: </b> {poDescription}
          </label>
          
          <label className='label input-half'>
            <b>Segment 6 Desc: </b> {segment6Desc}
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
