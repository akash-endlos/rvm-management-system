import axiosInstance from './api';

export const getAllMachinesApi = async () => {
  try {
    const response = await axiosInstance.get('/machine/get?type=all');
    console.log(response.data);
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createMachineApi = async (machineData) => {
  try {
    const response = await axiosInstance.post('/machine/add', machineData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMachineApi = async (machineId) => {
  try {
    const response = await axiosInstance.get(`/machines/${machineId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateMachineApi = async (machineId, machineData) => {
  try {
    console.log(machineData);
    const response = await axiosInstance.put(`/machine/update?id=${machineId}`, machineData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteMachineApi = async (machineId) => {
  try {
    const response = await axiosInstance.delete(`/machine/delete?id=${machineId}`);
    return response.data;
  } catch (error) {
    console.log(error.response);
    throw error.response.data;
  }
};
