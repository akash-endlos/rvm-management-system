import axiosInstance from './api';

export const getAllSolutionsApi = async () => {
  try {
    const response = await axiosInstance.get('/solution');
    console.log(response.data);
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createSolutionApi = async (solutionData) => {
  try {
    const response = await axiosInstance.post('/solution/', solutionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSolutionApi = async (solutionId) => {
  try {
    const response = await axiosInstance.get(`/solution/${solutionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateSolutionApi = async (solutionId, solutionData) => {
  try {
    const response = await axiosInstance.put(`solution/${solutionId}`, solutionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteSolutionApi = async (solutionId) => {
  try {
    const response = await axiosInstance.delete(`/solution/${solutionId}`);
    return response.data;
  } catch (error) {
    console.log(error.response);
    throw error.response.data;
  }
};
