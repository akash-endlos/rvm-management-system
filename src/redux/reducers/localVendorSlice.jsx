import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllLocalVendorsApi,
  createLocalVendorApi,
  getLocalVendorApi,
  deleteLocalVendorApi,
  updateLocalVendorApi,
} from '../api/localVendorApi';

export const fetchAllLocalVendors = createAsyncThunk(
  'localVendors/fetchAll',
  async () => {
    try {
      const response = await getAllLocalVendorsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewLocalVendor = createAsyncThunk(
  'localVendors/create',
  async (localVendorData, { rejectWithValue }) => {
    try {
      const response = await createLocalVendorApi(localVendorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLocalVendor = createAsyncThunk(
  'localVendors/fetchOne',
  async (localVendorId, { rejectWithValue }) => {
    try {
      const response = await getLocalVendorApi(localVendorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLocalVendor = createAsyncThunk(
  'localVendors/delete',
  async (localVendorId, { rejectWithValue }) => {
    try {
      await deleteLocalVendorApi(localVendorId._id);
      return localVendorId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLocalVendor = createAsyncThunk(
  'localVendors/update',
  async (localVendorData, { rejectWithValue }) => {
    try {
      const response = await updateLocalVendorApi(localVendorData.id, localVendorData.data);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const localVendorSlice = createSlice({
  name: 'localVendors',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLocalVendors.fulfilled, (state, action) => {
        const localVendorsWithIndex = action.payload.payload.vendors.map((localVendor, index) => ({
          ...localVendor,
          index: index + 1,
        }));
        return localVendorsWithIndex;
      })
      .addCase(createNewLocalVendor.fulfilled, (state, { payload }) => {
        console.log(payload);
        const newLocalVendor = {
          ...payload.payload.vendor,
          index: 1,
        };
        const updatedState = state.map((localVendor) => ({
          ...localVendor,
          index: localVendor.index + 1,
        }));
        state.unshift(newLocalVendor);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteLocalVendor.fulfilled, (state, { payload }) => {
        console.log(payload,state);
        const updatedState = state.filter((localVendor) => localVendor._id !== payload._id);
        const localVendorsWithUpdatedIndex = updatedState.map((localVendor, index) => ({
          ...localVendor,
          index: index + 1,
        }));
        return localVendorsWithUpdatedIndex;
      })
      .addCase(updateLocalVendor.fulfilled, (state, { payload }) => {
        
        const updatedLocalVendor = payload.payload.vendor;
        const updatedIndex = state.findIndex((localVendor) => localVendor._id === updatedLocalVendor._id);
        if (updatedIndex !== -1) {
          const newState = [...state];
          newState[updatedIndex] = {
            ...updatedLocalVendor,
            index: state[updatedIndex].index,
          };
          return newState;
        }
        return state;
      });
  },
});

export const { setLocalVendors, addLocalVendor } = localVendorSlice.actions;
export const localVendorReducer = localVendorSlice.reducer;
