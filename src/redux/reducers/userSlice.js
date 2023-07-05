import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllUsersApi,
  createUserApi,
  getUserApi,
  deleteUserApi,
  updateUserApi,
} from '../api/userApi';

export const fetchAllUsers = createAsyncThunk('users/fetchAll', async () => {
  const response = await getAllUsersApi();
  return response;
});

export const createUser = createAsyncThunk('users/create', async (userData) => {
  const response = await createUserApi(userData);
  return response;
});

export const fetchUser = createAsyncThunk('users/fetchOne', async (userId) => {
  const response = await getUserApi(userId);
  return response;
});

export const deleteUser = createAsyncThunk('users/delete', async (userId) => {
  console.log(userId);
  await deleteUserApi(userId);
  return userId;
});

export const updateUser = createAsyncThunk('users/update', async (userData) => {
  const response = await updateUserApi(userData.id, userData.data);
  return response;
});

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        const usersWithIndex = action.payload.map((user, index) => ({
          ...user,
          index: index + 1,
        }));
        return usersWithIndex;
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        const newUser = {
          ...payload,
          index: 1,
        };
        const updatedState = state.map((user) => ({
          ...user,
          index: user.index + 1,
        }));
        state.unshift(newUser);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((user) => user.id !== payload);
        const usersWithUpdatedIndex = updatedState.map((user, index) => ({
          ...user,
          index: index + 1,
        }));
        return usersWithUpdatedIndex;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const updatedUser = payload;
        const updatedIndex = state.findIndex((user) => user.id === updatedUser.id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedUser,
            index: state[updatedIndex].index, // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const userReducer = userSlice.reducer;
export const { setUsers, addUser } = userSlice.actions;
