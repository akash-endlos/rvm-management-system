import axiosInstance from './api';

export const getAllLocalVendorsApi = async () => {
  try {
    const response = await axiosInstance.get('/localvendor');
    console.log(response.data);
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createLocalVendorApi = async (localVendorData) => {
  try {
    const response = await axiosInstance.post('/localvendor', localVendorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLocalVendorApi = async (localVendorId) => {
  try {
    const response = await axiosInstance.get(`/localvendor/${localVendorId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateLocalVendorApi = async (localVendorId, localVendorData) => {
  try {
    const response = await axiosInstance.put(`/localvendor/${localVendorId}`, localVendorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteLocalVendorApi = async (localVendorId) => {
  try {
    const response = await axiosInstance.delete(`/localvendors/delete?id=${localVendorId}`);
    return response.data;
  } catch (error) {
    console.log(error.response);
    throw error.response.data;
  }
};
