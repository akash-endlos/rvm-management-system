import axiosInstance from './api';

export const getAllRolesApi = async () => {
  try {
    const response = await axiosInstance.get('/userrole/');
    return response?.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createRoleApi = async (roleData) => {
  try {
    const response = await axiosInstance.post('/userrole/', roleData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRoleApi = async (roleId) => {
  try {
    const response = await axiosInstance.get(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateRoleApi = async (roleId, roleData) => {
  try {
    const response = await axiosInstance.put(`/userrole/${roleId}`, roleData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteRoleApi = async (roleId) => {
  try {
    const response = await axiosInstance.delete(`/userrole/${roleId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
