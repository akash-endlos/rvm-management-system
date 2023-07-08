import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllVendorsApi, createVendorApi, getVendorApi, deleteVendorApi, updateVendorApi } from '../api/vendorApi';

export const fetchAllVendors = createAsyncThunk(
  'vendors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllVendorsApi();
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createNewVendor = createAsyncThunk(
  'vendors/create',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await createVendorApi(vendorData);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVendor = createAsyncThunk(
  'vendors/fetchOne',
  async (vendorId, { rejectWithValue }) => {
    try {
      const response = await getVendorApi(vendorId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/delete',
  async (vendorId, { rejectWithValue }) => {
    try {
      console.log(vendorId);
      await deleteVendorApi(vendorId);
      return vendorId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateVendor = createAsyncThunk(
  'vendors/update',
  async (vendorData, { rejectWithValue }) => {
    try {
      const response = await updateVendorApi(vendorData.id, vendorData.data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const vendorSlice = createSlice({
  name: 'vendors',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        console.log(action.payload.payload.vendors);
        const vendorsWithIndex = action.payload.payload.vendors.map((vendor, index) => ({
          ...vendor,
          index: index + 1,
        }));
        return vendorsWithIndex;
      })
      .addCase(createNewVendor.fulfilled, (state, { payload }) => {
        console.log(payload);
        const newVendor = {
          ...payload.payload.vendor,
          index: 1,
        };
        const updatedState = state.map((vendor) => ({
          ...vendor,
          index: vendor.index + 1,
        }));
        state.unshift(newVendor);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteVendor.fulfilled, (state, { payload }) => {
        console.log(payload);
        const updatedState = state.filter((vendor) => vendor._id !== payload);
        const vendorsWithUpdatedIndex = updatedState.map((vendor, index) => ({
          ...vendor,
          index: index + 1,
        }));
        return vendorsWithUpdatedIndex;
      })
      .addCase(updateVendor.fulfilled, (state, { payload }) => {
        const updatedVendor = payload.payload.vendor;
        const updatedIndex = state.findIndex((vendor) => vendor._id === updatedVendor._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedVendor,
            index: state[updatedIndex].index, // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const vendorReducer = vendorSlice.reducer;
