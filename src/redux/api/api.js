import axios from 'axios';
import { store } from '../store';
import { logout, refreshAccessToken, updateAccessToken } from '../reducers/authSlice';

const apiUrl = 'https://api-rvm.endlos.live/api/v1/';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.user?.token.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    console.log(store?.getState()?.auth?.user?.token?.refreshToken);
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      store?.getState()?.auth?.user?.token?.refreshToken
    ) {
      originalRequest._retry = true;
      console.log('kkkkkkkkkkkkkkkk',originalRequest._retry);

      return store.dispatch(refreshAccessToken())
        .then((newAccessToken) => {
          console.log(newAccessToken);
          store.dispatch(updateAccessToken(newAccessToken)); // Update the access token in the Redux store
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((refreshError) => {
          console.log(refreshError);
          // Handle refresh token error or logout the user
          store.dispatch(logout());
          return Promise.reject(refreshError);
        });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
