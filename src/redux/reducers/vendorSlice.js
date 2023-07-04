import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllVendorsApi, createVendorApi, getVendorApi, deleteVendorApi, updateVendorApi } from '../api/vendorApi';

export const fetchAllVendors = createAsyncThunk(
  'vendors/fetchAll',
  async () => {
    const response = await getAllVendorsApi();
    console.log(response);
    return response;
  }
);

export const createNewVendor = createAsyncThunk(
  'vendors/create',
  async (vendorData) => {
    const response = await createVendorApi(vendorData);
    return response;
  }
);

export const fetchVendor = createAsyncThunk(
  'vendors/fetchOne',
  async (vendorId) => {
    const response = await getVendorApi(vendorId);
    return response;
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/delete',
  async (vendorId) => {
    console.log(vendorId._id);
    await deleteVendorApi(vendorId._id);
    return vendorId;
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/update',
  async (vendorData) => {
    const response = await updateVendorApi(vendorData.id, { name: vendorData.name });
    return response;
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
        const updatedState = state.filter((vendor) => vendor._id !== payload._id);
        const vendorsWithUpdatedIndex = updatedState.map((vendor, index) => ({
          ...vendor,
          index: index + 1,
        }));
        return vendorsWithUpdatedIndex;
      })
      .addCase(updateVendor.fulfilled, (state, { payload }) => {
        const updatedVendor = payload.payload.updatedVendor;
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
