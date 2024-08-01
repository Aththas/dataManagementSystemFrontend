import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { success, data: responseData, message } = response.data;

      if (success && responseData) {
        const { accessToken, refreshToken } = responseData;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(message || "Authentication failed.");
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        setErrorMessage(data.message || "An error occurred.");
      } else {
        setErrorMessage("Network Error: Please check your connection.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div>
      {loading && <LoadingSpinner />} {/* Show spinner while loading */}
      <form onSubmit={handleSubmit(onSubmit)}  className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">Login</button>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form> 
    </div>
  );
};

export default LoginForm;
