import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8090/mobi_DM/api/v1',
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post('/auth/refresh-token', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('refreshToken')}`
          }
        });
        const { accessToken } = response.data.data;
        sessionStorage.setItem('accessToken', accessToken);
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        window.location.href = '/mobiDM/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
