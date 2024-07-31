import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/verify-otp', {
        email: email,
        otp: data.otp,
      });

      const { success, message: responseMessage, errorCode } = response.data;

      if (success) {
        setMessage(responseMessage);
        setErrorMessage("");
        navigate('/reset-password'); // Redirect to reset password page
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
    }
  };

  return (
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
  );
};

export default VerifyOtpForm;
