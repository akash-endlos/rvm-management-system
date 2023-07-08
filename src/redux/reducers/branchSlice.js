import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBranchApi, deleteBranchApi, updateBranchApi } from '../api/branchApi';

export const createNewBranch = createAsyncThunk(
  'branch/create',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await createBranchApi(branchData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'branch/delete',
  async (branchId, { rejectWithValue }) => {
    try {
      await deleteBranchApi(branchId);
      return branchId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBranch = createAsyncThunk(
  'branch/update',
  async (branchData, { rejectWithValue }) => {
    try {
      const response = await updateBranchApi(branchData?.id, { name: branchData?.name });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const branchSlice = createSlice({
  name: 'branch',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(createNewBranch.fulfilled, (state, { payload }) => {
        console.log(payload);
        const newBranch = {
          ...payload.payload.Branch,
          index: 1,
        };
        const updatedState = state.map((branch) => ({
          ...branch,
          index: branch.index + 1,
        }));
        state.unshift(newBranch);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteBranch.fulfilled, (state, { payload }) => {
        const branchId = payload;
        const updatedState = state.filter((branch) => branch.id !== branchId);
        return updatedState;
      })
      .addCase(updateBranch.fulfilled, (state, { payload }) => {
        const updatedBranch = payload;
        const branchIndex = state.findIndex((branch) => branch.id === updatedBranch.id);
        if (branchIndex !== -1) {
          const updatedState = [...state];
          updatedState[branchIndex] = updatedBranch;
          return updatedState;
        }
        return state;
      });
  },
});

export const branchReducer = branchSlice.reducer;
