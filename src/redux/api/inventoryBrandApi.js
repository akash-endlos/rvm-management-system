import axiosInstance from './api';

export const getAllInventoryBrandsApi = async () => {
  try {
    const response = await axiosInstance.get('/inventory-brands');
    return response?.data?.payload?.InventoryBrand;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const createInventoryBrandApi = async (inventoryBrandData) => {
  try {
    const response = await axiosInstance.post('/inventory-brands/add', inventoryBrandData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const getInventoryBrandApi = async (brandId) => {
  try {
    const response = await axiosInstance.get(`/inventory-brands/${brandId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const updateInventoryBrandApi = async (brandId, inventoryBrandData) => {
  try {
    const response = await axiosInstance.put(`/inventory-brands/update?id=${brandId}`, inventoryBrandData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export const deleteInventoryBrandApi = async (brandId) => {
  try {
    const response = await axiosInstance.delete(`/inventory-brands/delete?id=${brandId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};
