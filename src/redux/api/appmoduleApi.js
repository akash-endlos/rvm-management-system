// api.js - assuming you have axiosInstance defined here
import axiosInstance from './api';


export const getAllCustomersApi = async () => {
    try {
      const response = await axiosInstance.get('/customer/getAll');
      console.log(response.data);
      return response?.data?.payload?.Customer;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const createCustomerApi = async (customerData) => {
    try {
      const response = await axiosInstance.post('/customer/add', customerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const getCustomerApi = async (customerId) => {
    try {
      const response = await axiosInstance.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const updateCustomerApi = async (customerId, customerData) => {
    try {
      const response = await axiosInstance.put(`customer/update?id=${customerId}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
  export const deleteCustomerApi = async (customerId) => {
    try {
      const response = await axiosInstance.delete(`/customer/delete?id=${customerId}`);
      return response.data;
    } catch (error) {
      console.log(error.response);
      throw error.response.data;
    }
  };
  