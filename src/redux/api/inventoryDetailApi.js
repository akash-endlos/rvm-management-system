import axiosInstance from './api';

export const getInventoryDetailsApi = async () => {
  try {
    const response = await axiosInstance.get('/inventry/get?type=all');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createInventoryDetailApi = async (inventoryDetailData) => {
  try {
    const response = await axiosInstance.post('/inventry/add', inventoryDetailData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateInventoryDetailApi = async (inventoryDetailData) => {
  try {
    const response = await axiosInstance.put(`/inventory-details/${inventoryDetailData.id}`, inventoryDetailData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteInventoryDetailApi = async (inventoryDetailId) => {
  try {
    const response = await axiosInstance.delete(`/inventry/delete?id=${inventoryDetailId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
