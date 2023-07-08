import axiosInstance from './api';

export const getAllInventoryTypesApi = async () => {
  try {
    const response = await axiosInstance.get('inventrytype/getAll?type=allInventries');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getInventoryTypeApi = async (inventoryTypeId) => {
  try {
    const response = await axiosInstance.get(`/inventory-types/${inventoryTypeId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createInventoryTypeApi = async (inventoryTypeData) => {
  try {
    const response = await axiosInstance.post('/inventrytype/add', inventoryTypeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateInventoryTypeApi = async (inventoryTypeId, inventoryTypeData) => {
  try {
    const response = await axiosInstance.put(`/inventrytype/update?id=${inventoryTypeId}`, inventoryTypeData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteInventoryTypeApi = async (inventoryTypeId) => {
  try {
    const response = await axiosInstance.delete(`/inventrytype/delete?id=${inventoryTypeId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
