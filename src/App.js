import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
//import ForgotPasswordPage from './pages/ForgotPasswordPage';
//import VerifyOtpPage from './pages/VerifyOtpPage';
//import ResetPasswordPage from './pages/ResetPasswordPage';
//import HomePage from './pages/HomePage';
import DisplayUsersPage from './admin/pages/DisplayUsersPage';
import DisplayAmcPage from './admin/pages/DisplayAmcPage';
import DisplayAmcUserActivityPage from './admin/pages/DisplayAmcUserActivityPage';
import DisplayPoPage from './admin/pages/DisplayPoPage';
import DisplayPoUserActivityPage from './admin/pages/DisplayPoUserActivityPage';
//import DisplayProfilePage from './admin/pages/DisplayProfilePage';
import DisplayProvideAccessManualPage from './admin/pages/DisplayProvideAccessManualPage';
import DisplayAccessRequestPage from './admin/pages/DisplayAccessRequestPage';
import DisplayProvideAccessRequestPage from './admin/pages/DisplayProvideAccessRequestPage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/mobiDM/login" />} />
        <Route path="/mobiDM" element={<LoginPage />} />
        <Route path="/mobiDM/login" element={<LoginPage />} />
        {/*<Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/new-password" element={<ResetPasswordPage />} />*/}
        <Route path="/mobiDM/view-users" element={<DisplayUsersPage/>} />
        <Route path="/mobiDM/view-amcList" element={<DisplayAmcPage/>} />
        <Route path="/mobiDM/user-activity-amc" element={<DisplayAmcUserActivityPage />} />
        <Route path="/mobiDM/view-poList" element={<DisplayPoPage />} />
        <Route path="/mobiDM/user-activity-PO" element={<DisplayPoUserActivityPage />} />
        {/*<Route path="/user-profile" element={<DisplayProfilePage />} />*/}
        <Route path="/mobiDM/provide-access-manual" element={<DisplayProvideAccessManualPage />} />
        <Route path="/mobiDM/access-request" element={<DisplayAccessRequestPage />} />
        <Route path="/mobiDM/provide-access-request" element={<DisplayProvideAccessRequestPage />} />
      </Routes>
    </Router>
  );
}

export default App;
