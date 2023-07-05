import axiosInstance from './api';

export const getAllRolesApi = async () => {
  try {
    const response = await axiosInstance.get('/roles/getAll');
    console.log(response.data);
    return response?.data?.payload?.Roles;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const createRoleApi = async (roleData) => {
  try {
    const response = await axiosInstance.post('/roles/add', roleData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const getRoleApi = async (roleId) => {
  try {
    const response = await axiosInstance.get(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};

export const updateRoleApi = async (roleId, roleData) => {
  try {
    const response = await axiosInstance.put(`/roles/update?id=${roleId}`, roleData);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const deleteRoleApi = async (roleId) => {
  try {
    const response = await axiosInstance.delete(`/roles/delete?id=${roleId}`);
    return response.data;
  } catch (error) {
    throw Error(error.response.data.error);
  }
};
