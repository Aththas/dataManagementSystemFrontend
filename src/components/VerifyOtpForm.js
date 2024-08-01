import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner

const VerifyOtpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/verify-otp', {
        email: email,
        otp: data.otp,
      });

      const { success, message: responseMessage } = response.data;

      if (success) {
        setMessage(responseMessage);
        setErrorMessage("");
        navigate('/reset-password');
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
      <form onSubmit={handleSubmit(onSubmit)} className="verify-otp-form">
        <div className="form-group">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            {...register('otp', { required: 'OTP is required' })}
          />
          {errors.otp && <p>{errors.otp.message}</p>}
        </div>
        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default VerifyOtpForm;
