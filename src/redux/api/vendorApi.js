import axiosInstance from './api';

export const getAllVendorsApi = async () => {
  try {
    const response = await axiosInstance.get('/vendor');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getVendorApi = async (vendorId) => {
  try {
    const response = await axiosInstance.get(`/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createVendorApi = async (vendorData) => {
  try {
    const response = await axiosInstance.post('/vendor', vendorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateVendorApi = async (vendorId, vendorData) => {
  try {
    const response = await axiosInstance.put(`/vendor/${vendorId}`, vendorData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteVendorApi = async (vendorId) => {
  try {
    const response = await axiosInstance.delete(`/vendor/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
