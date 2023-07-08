import axiosInstance from './api';

export const getAllProblemsApi = async () => {
  try {
    const response = await axiosInstance.get('/problem/getAll');
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createProblemApi = async (problemData) => {
  try {
    const response = await axiosInstance.post('/problem/add', problemData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProblemApi = async (problemId) => {
  try {
    const response = await axiosInstance.get(`/problems/${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProblemApi = async (problemId, problemData) => {
  try {
    const response = await axiosInstance.put(`problem/update?id=${problemId}`, problemData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteProblemApi = async (problemId) => {
  try {
    const response = await axiosInstance.delete(`/problem/delete?id=${problemId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
