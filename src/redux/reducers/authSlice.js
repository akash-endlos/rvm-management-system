import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, refreshTokenApi } from '../api/authApi';

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  try {
    const response = await loginApi(credentials);
    console.log(response);
    return response.payload;
  } catch (error) {
    throw error;
  }
});

export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async () => {
  try {
    const response = await refreshTokenApi();
    return response.data;
  } catch (error) {
    throw error;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    updateAccessToken: (state, action) => {
      console.log(action);
      state.user.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.user.accessToken = action.payload.accessToken;
      });
  },
});

export const { logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
