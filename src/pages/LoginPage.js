import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css';


const LoginPage = () => {
  return (
    <div className="login-page">
        <h1>Login</h1>
        <LoginForm />
      </div>
  );
};

export default LoginPage;
