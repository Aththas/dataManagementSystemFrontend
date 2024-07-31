import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import '../styles/ForgotPasswordPage.css'; // Ensure this path is correct

const ForgotPasswordPage = () => {
  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPasswordPage;
