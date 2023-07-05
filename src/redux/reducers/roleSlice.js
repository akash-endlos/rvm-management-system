import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllRolesApi, createRoleApi, getRoleApi, deleteRoleApi, updateRoleApi } from '../api/roleApi';

export const fetchAllRoles = createAsyncThunk(
  'roles/fetchAll',
  async () => {
    const response = await getAllRolesApi();
    return response;
  }
);

export const createNewRole = createAsyncThunk(
  'roles/create',
  async (roleData) => {
    const response = await createRoleApi(roleData);
    return response;
  }
);

export const fetchRole = createAsyncThunk(
  'roles/fetchOne',
  async (roleId) => {
    const response = await getRoleApi(roleId);
    return response;
  }
);

export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (roleId) => {
    console.log(roleId._id);
    await deleteRoleApi(roleId._id);
    return roleId;
  }
);

export const updateRole = createAsyncThunk(
  'roles/update',
  async (roleData) => {
    const response = await updateRoleApi(roleData.id, { name: roleData.name });
    return response;
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        const rolesWithIndex = action.payload.map((role, index) => ({
          ...role,
          index: index + 1,
        }));
        return rolesWithIndex;
      })
      .addCase(createNewRole.fulfilled, (state, { payload }) => {
        const newRole = {
          ...payload.payload.Role,
          index: 1,
        };
        const updatedState = state.map((role) => ({
          ...role,
          index: role.index + 1,
        }));
        state.unshift(newRole);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteRole.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((role) => role._id !== payload._id);
        const rolesWithUpdatedIndex = updatedState.map((role, index) => ({
          ...role,
          index: index + 1,
        }));
        return rolesWithUpdatedIndex;
      })
      .addCase(updateRole.fulfilled, (state, { payload }) => {
        const updatedRole = payload.payload.updatedRole;
        const updatedIndex = state.findIndex((role) => role._id === updatedRole._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedRole,
            index: state[updatedIndex].index, // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const { setRoles, addRole } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;
