import axiosInstance from './api';

export const getAllStocksApi = async () => {
  try {
    const response = await axiosInstance.get('/stock');
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createStockApi = async (stockData) => {
  try {
    const response = await axiosInstance.post('/stock', stockData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStockApi = async (stockId) => {
  try {
    const response = await axiosInstance.get(`/stocks/${stockId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateStockApi = async (stockId, stockData) => {
  try {
    const response = await axiosInstance.put(`stock/${stockId}`, stockData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteStockApi = async (stockId) => {
  try {
    const response = await axiosInstance.delete(`/stock/${stockId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
