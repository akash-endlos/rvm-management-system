import axiosInstance from './api';

export const getAllInventoryTypesApi = async () => {
  try {
    const response = await axiosInstance.get('inventrytype/getAll?type=allInventries');
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const getInventoryTypeApi = async (inventoryTypeId) => {
  try {
    const response = await axiosInstance.get(`/inventory-types/${inventoryTypeId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const createInventoryTypeApi = async (inventoryTypeData) => {
  try {
    const response = await axiosInstance.post('/inventrytype/add', inventoryTypeData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateInventoryTypeApi = async (inventoryTypeId, inventoryTypeData) => {
  try {
    const response = await axiosInstance.put(`/inventory-type/update?id=${inventoryTypeId}`, inventoryTypeData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const deleteInventoryTypeApi = async (inventoryTypeId) => {
  try {
    const response = await axiosInstance.delete(`/inventory-type/delete?id=${inventoryTypeId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
