import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner

const ResetPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/new-password', {
        email: email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      const { success, message: responseMessage } = response.data;

      if (success) {
        setMessage(responseMessage);
        setErrorMessage("");
        navigate('/login'); // Redirect to login page after successful password reset
      } else {
        setMessage("");
        setErrorMessage(responseMessage);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        setErrorMessage(data.message || "An error occurred.");
      } else {
        setErrorMessage("Network Error: Please check your connection.");
      }
      setMessage("");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />} {/* Show spinner while loading */}
      <form onSubmit={handleSubmit(onSubmit)} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            {...register('newPassword', { required: 'New Password is required' })}
          />
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', { required: 'Confirm Password is required' })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
