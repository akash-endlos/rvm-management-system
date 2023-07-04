import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createBranchApi } from '../api/branchApi';

export const createNewBranch = createAsyncThunk(
  'branch/create',
  async (branchData) => {
    const response = await createBranchApi(branchData);
    console.log(response);
    return response;
  }
);

const branchSlice = createSlice({
  name: 'branch',
  initialState: [],
  extraReducers: (builder) => {
    builder.addCase(createNewBranch.fulfilled, (state, { payload }) => {
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
    });
  },
});

export const branchReducer = branchSlice.reducer;
