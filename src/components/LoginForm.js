import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8090/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { success, data: responseData, message, errorCode } = response.data;

      if (success && responseData) {
        const { accessToken, refreshToken } = responseData;
        
        // Save tokens to localStorage or handle them as needed
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Redirect to another page or handle successful login
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
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
      </form>
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
    </div>
  );
};

export default LoginForm;
