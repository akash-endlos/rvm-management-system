import axiosInstance from './api';




export const getAllCustomersApi = async () => {
  try {
    const response = await axiosInstance.get('/customer/getAll');
    console.log(response);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};


export const createCustomerApi = async (customerData) => {
  try {
    const response = await axiosInstance.post('/customers', customerData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const getCustomerApi = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateCustomerApi = async (customerId, customerData) => {
  try {
    const response = await axiosInstance.put(`/customers/${customerId}`, customerData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const deleteCustomerApi = async (customerId) => {
  try {
    const response = await axiosInstance.delete(`/customers/${customerId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
