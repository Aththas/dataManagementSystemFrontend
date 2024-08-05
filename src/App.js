import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import DisplayUsersPage from './admin/pages/DisplayUsersPage';
import DisplayAmcPage from './admin/pages/DisplayAmcPage';
import DisplayAmcUserActivityPage from './admin/pages/DisplayAmcUserActivityPage';
import DisplayPoPage from './admin/pages/DisplayPoPage';
import DisplayPoUserActivityPage from './admin/pages/DisplayPoUserActivityPage';
import DisplayProfilePage from './admin/pages/DisplayProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/new-password" element={<ResetPasswordPage />} />
        <Route path="/view-users" element={<DisplayUsersPage/>} />
        <Route path="/view-amcList" element={<DisplayAmcPage/>} />
        <Route path="/user-activity-amc" element={<DisplayAmcUserActivityPage />} />
        <Route path="/view-poList" element={<DisplayPoPage />} />
        <Route path="/user-activity-PO" element={<DisplayPoUserActivityPage />} />
        <Route path="/user-profile" element={<DisplayProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
