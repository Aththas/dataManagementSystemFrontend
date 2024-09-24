import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../loading/LoadingSpinner'; // Import LoadingSpinner
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/form.css'; // Import CSS file
import img1 from '../../img/1.jpg';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');

  const onSubmit = async (data) => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post('https://cbpapi-stg.mobitel.lk/mobi_DM/api/v1/auth/new-password', {
        email: email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      const { success, message: responseMessage } = response.data;

      if (success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset',
          text: responseMessage || "Password has been reset successfully",
          customClass: {
            container: 'swal-modal',
            title: 'swal-title',
            content: 'swal-text',
            confirmButton: 'swal-button'
          }
        });
        navigate('/login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: responseMessage || "Password Confirmation Error.",
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
          title: 'Password Reset Failed',
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
                <h1><span>New</span> <span className='p'>Password</span></h1>
                <p className='p'>Forgot the password? No Worries. But don't forgot it every time :)</p>
                {loading && <LoadingSpinner />} {/* Show spinner while loading */}
                <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
                  <div className="form-row py-2">
                    <div className="col-lg-12">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        {...register('newPassword', { required: 'New Password is required' })}
                      />
                      {errors.email && <p>{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="form-row py-2">
                    <div className="col-lg-12">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', { required: 'Confirm Password is required' })}
                      />
                      {errors.password && <p>{errors.password.message}</p>}
                    </div>
                  </div>
                  <button type="submit" className="btn1 mb-3 mt-4">Reset Password</button>
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
