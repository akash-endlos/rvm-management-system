import axios from 'axios';
import { store } from '../store';

const apiUrl = 'https://api-rvm.endlos.live/api/v1/';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

let isRefreshing = false;
let refreshSubscribers = [];

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store?.getState()?.auth?.user?.token?.accessToken;
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
  (response) => response,
  (error) => {
    const { config, response } = error;

    if (response.status === 401 && !config._retry) {
      if (!isRefreshing) {
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          refreshAccessToken()
            .then((newTokens) => {
              config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              config._retry = true;
              refreshSubscribers.forEach((subscriber) => subscriber(newTokens.accessToken));
              resolve(axiosInstance(config));
            })
            .catch((refreshError) => {
              reject(refreshError);
            })
            .finally(() => {
              isRefreshing = false;
              refreshSubscribers = [];
            });
        });
      } else {
        return new Promise((resolve) => {
          subscribeTokenRefresh((accessToken) => {
            config.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosInstance(config));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function refreshAccessToken() {
  return new Promise((resolve, reject) => {
    const refreshToken = store?.getState()?.auth?.user?.token?.refreshToken;
    if (!refreshToken) {
      reject(new Error('No refresh token available'));
      return;
    }

    axiosInstance
      .post('/auth/refreshtoken', { refreshToken })
      .then((response) => {
        const { accessToken, refreshToken } = response.data;
        resolve({ accessToken, refreshToken });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default axiosInstance;
