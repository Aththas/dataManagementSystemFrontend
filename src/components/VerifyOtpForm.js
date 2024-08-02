import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/form.css'; // Import CSS file
import img1 from '../styles/img/1.jpg';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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
        Swal.fire({
          icon: 'success',
          title: 'OTP Verification',
          text: responseMessage || "OTP has been Verified",
          customClass: {
            container: 'swal-modal',
            title: 'swal-title',
            content: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
        navigate('/new-password');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'OTP Verification Failed',
          text: responseMessage || "Invalid OTP",
          customClass: {
            container: 'swal-modal',
            title: 'swal-title',
            content: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
        Swal.fire({
          icon: 'error',
          title: 'OTP Verification Failed',
          text: data.message || "An error occurred.",
          customClass: {
            container: 'swal-modal',
            title: 'swal-title',
            content: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: "Please check your connection.",
          customClass: {
            container: 'swal-modal',
            title: 'swal-title',
            content: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section className="login">
      <div className="container py-5 text-center text-white screen">
        <div className="row no-gutters">
          <div className="col-lg-4">
            <div id="carouselExampleCaptions" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="First slide" />
                  <div className="carousel-caption d-none d-md-block">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8 py-5 log">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <h1><span>OTP</span> <span className='p'>Verification</span></h1>
                <p className='p'>Enter your verification code</p>
                {loading && <LoadingSpinner />} {/* Show spinner while loading */}
                <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
                  <div className="form-row py-2">
                    <div className="col-lg-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="OTP Code"
                        {...register('otp', { required: 'OTP Code is required' })}
                      />
                      {errors.email && <p>{errors.email.message}</p>}
                    </div>
                  </div>
                  <button type="submit" className="btn1 mb-3 mt-4">Enter Verification Code</button>
                  <br />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
