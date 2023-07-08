import axiosInstance from './api';

export const getAllBranchesApi = async () => {
  try {
    const response = await axiosInstance.get('/branches');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getBranchApi = async (branchId) => {
  try {
    const response = await axiosInstance.get(`/branches/${branchId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createBranchApi = async (branchData) => {
  try {
    const response = await axiosInstance.post('/branch/add', branchData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateBranchApi = async (branchId, branchData) => {
  try {
    const response = await axiosInstance.put(`/branch/update?id=${branchId}`, branchData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteBranchApi = async (branchId) => {
  try {
    const response = await axiosInstance.delete(`/branch/delete?id=${branchId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
