import axiosInstance from './api';

export const getInventoryDetailsApi = async (inventoryId) => {
  try {
    const response = await axiosInstance.get(`/inventory-details/${inventoryId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const createInventoryDetailApi = async (inventoryDetailData) => {
  try {
    const response = await axiosInstance.post('/inventry/add', inventoryDetailData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateInventoryDetailApi = async (inventoryId, inventoryDetailData) => {
  try {
    const response = await axiosInstance.put(`/inventory-details/update?id=${inventoryId}`, inventoryDetailData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const deleteInventoryDetailApi = async (inventoryId) => {
  try {
    const response = await axiosInstance.delete(`/inventory-details/delete?id=${inventoryId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
