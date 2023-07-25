import axiosInstance from './api';

export const getAllInventoryBrandsApi = async () => {
  try {
    const response = await axiosInstance.get('/inventrybrand/');
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createInventoryBrandApi = async (inventoryBrandData) => {
  try {
    const response = await axiosInstance.post('/inventrybrand/', inventoryBrandData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getInventoryBrandApi = async (brandId) => {
  try {
    const response = await axiosInstance.get(`inventrytype/get?id=${brandId}&type=allInventries`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateInventoryBrandApi = async (brandId, inventoryBrandData) => {
  try {
    const response = await axiosInstance.put(`/inventrybrand/${brandId}`, inventoryBrandData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteInventoryBrandApi = async (brandId) => {
  try {
    const response = await axiosInstance.delete(`/inventrybrand/${brandId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getInventoryBrandByInventoryTypeApi = async (inventoryTypeId) => {
  try {
    const response = await axiosInstance.get(`/inventrybrand/${inventoryTypeId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
