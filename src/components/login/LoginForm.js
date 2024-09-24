import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
//import { Link } from 'react-router-dom';
import LoadingSpinner from '../loading/LoadingSpinner'; 
import 'sweetalert2/dist/sweetalert2.min.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/form.css'; 
import img1 from '../../img/mobitel.png';
import './swal.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
//import CryptoJS from 'crypto-js';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false); // Add loading state

  /*const secretKey = 'SdRgl+f1UTdBZEtlAzoSGffoz/56l7/0lg2AC0q6yPM=';

  function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  }*/

  const onSubmit = async (data) => {
    console.log(window.innerWidth);
    //localStorage.removeItem('resetEmail');
    setLoading(true); // Start loading
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      showDuration: 300,
      hideDuration: 300,
      tapToDismiss: false,
    };

    try {
      const response = await axios.post('http://localhost:8090/mobi_DM/api/v1/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { success, data: responseData, message } = response.data;
      console.log(message);
      if (success && responseData) {
        const { accessToken, refreshToken } = responseData;
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        console.log(refreshToken);
        if(message === "ADMIN"){
          window.location.href = '/mobiDM/view-users';
        }else if(message === "MANAGER"){
          window.location.href = '/mobiDM/view-amcList';
        }
      } else {
        toastr.error('Authentication Failed!', '');
      }
    } catch (error) {
      if (error.response) {
        toastr.error('Authentication Failed!', '');
      } else {
        toastr.error('Network Error!!!', '');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section className="login">
      <div className="container py-5 text-center text-white screen login-screen">
        <div className="row no-gutters">
        <div className="col-lg-3"></div>
          <div className="col-lg-6" style={{marginBottom:'20px'}}>
            <div id="carouselExampleCaptions" className="carousel slide" data-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={img1} className="d-block w-100" alt="First slide" style={{opacity:1.5}}/>
                  <div className="carousel-caption d-none d-md-block">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
          <div className="col-lg-2"></div>
          <div className="col-lg-8 py-5 log">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <h1><span className='p'>m</span><span>COMS</span> <span className='p'>Login</span></h1>
                <p className='p' style={{fontWeight:'bold', textTransform:'uppercase'}}>Mobitel <span style={{color:'#50b748'}}>Capex Opex Management System</span> </p> 
                {loading && <LoadingSpinner />} {/* Show spinner while loading */}
                <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
                  <div className="form-row py-2">
                    <div className="col-lg-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        {...register('email', { required: 'ID is required' })}
                      />
                      {errors.email && <p>{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="form-row py-2">
                    <div className="col-lg-12">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        {...register('password', { required: 'Password is required' })}
                      />
                      {errors.password && <p>{errors.password.message}</p>}
                    </div>
                  </div>
                  <button type="submit" className="btn1 mb-3 mt-4">Login</button>
                  <br />
                  {/*<small>Forgot Password? <span><Link to="/forgot-password">Reset Password</Link></span></small>*/}
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
