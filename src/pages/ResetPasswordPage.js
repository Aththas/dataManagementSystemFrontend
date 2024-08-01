import React from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';
import '../styles/ResetPasswordPage.css';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page">
      <h1>Reset Password</h1>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
