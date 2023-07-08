import axiosInstance from './api';

export const getAllUsersApi = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createUserApi = async (userData) => {
  try {
    const response = await axiosInstance.post('/user/register', userData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserApi = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUserApi = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/user/${userId}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUserApi = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/user/${userId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
