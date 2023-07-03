
import axiosInstance from './api';

export const loginApi = async (credentials) => {
  try {
    const response = await axiosInstance.post(`user/login`, credentials);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};



export const refreshTokenApi = async () => {
  try {
    const response = await axiosInstance.post('/auth/refreshtoken');
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};