import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllVendorsApi, createVendorApi, getVendorApi, updateVendorApi, deleteVendorApi } from '../api/vendorApi';

export const fetchAllVendors = createAsyncThunk(
  'vendors/fetchAll',
  async () => {
    const response = await getAllVendorsApi();
    return response.payload;
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

export const updateVendor = createAsyncThunk(
  'vendors/update',
  async ({ vendorId, vendorData }) => {
    const response = await updateVendorApi(vendorId, vendorData);
    return { vendorId, vendorData };
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/delete',
  async (vendorId) => {
    await deleteVendorApi(vendorId);
    return vendorId;
  }
);

const vendorSlice = createSlice({
  name: 'vendors',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllVendors.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createNewVendor.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(fetchVendor.fulfilled, (state, action) => {
        // Handle updating specific vendor data in state
      })
      .addCase(updateVendor.fulfilled, (state, action) => {
        const { vendorId, vendorData } = action.payload;
        const vendorIndex = state.findIndex((vendor) => vendor.id === vendorId);
        if (vendorIndex !== -1) {
          state[vendorIndex] = { id: vendorId, ...vendorData };
        }
      })
      .addCase(deleteVendor.fulfilled, (state, action) => {
        const vendorId = action.payload;
        const vendorIndex = state.findIndex((vendor) => vendor.id === vendorId);
        if (vendorIndex !== -1) {
          state.splice(vendorIndex, 1);
        }
      });
  },
});

export const vendorActions = vendorSlice.actions;
export const vendorReducer = vendorSlice.reducer;
