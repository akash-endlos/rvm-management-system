import axiosInstance from './api';

export const getAllUsersApi = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response?.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const createUserApi = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/register', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const getUserApi = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateUserApi = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const deleteUserApi = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
