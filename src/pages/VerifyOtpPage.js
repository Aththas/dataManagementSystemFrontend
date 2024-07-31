import React from 'react';
import VerifyOtpForm from '../components/VerifyOtpForm';
import '../styles/VerifyOtpPage.css';

const VerifyOtpPage = () => {
  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      <VerifyOtpForm />
    </div>
  );
};

export default VerifyOtpPage;
