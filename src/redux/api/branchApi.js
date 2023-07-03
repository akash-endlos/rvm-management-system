import axiosInstance from './api';

export const getAllBranchesApi = async () => {
  try {
    const response = await axiosInstance.get('/branches');
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const getBranchApi = async (branchId) => {
  try {
    const response = await axiosInstance.get(`/branches/${branchId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const createBranchApi = async (branchData) => {
  try {
    const response = await axiosInstance.post('/branches', branchData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateBranchApi = async (branchId, branchData) => {
  try {
    const response = await axiosInstance.put(`/branches/${branchId}`, branchData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const deleteBranchApi = async (branchId) => {
  try {
    const response = await axiosInstance.delete(`/branches/${branchId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
