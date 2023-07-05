import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getInventoryDetailApi,
  createInventoryDetailApi,
  updateInventoryDetailApi,
  deleteInventoryDetailApi,
} from '../api/inventoryDetailApi';

export const fetchInventoryDetail = createAsyncThunk(
  'inventoryDetail/fetchOne',
  async (inventoryId) => {
    const response = await getInventoryDetailApi(inventoryId);
    return response;
  }
);

export const createNewInventoryDetail = createAsyncThunk(
  'inventoryDetail/create',
  async (inventoryDetailData) => {
    const response = await createInventoryDetailApi(inventoryDetailData);
    return response;
  }
);

export const updateInventoryDetail = createAsyncThunk(
  'inventoryDetail/update',
  async ({ inventoryId, inventoryDetailData }) => {
    const response = await updateInventoryDetailApi(inventoryId, inventoryDetailData);
    return response;
  }
);

export const deleteInventoryDetail = createAsyncThunk(
  'inventoryDetail/delete',
  async (inventoryId) => {
    await deleteInventoryDetailApi(inventoryId);
    return inventoryId;
  }
);

const inventoryDetailSlice = createSlice({
  name: 'inventoryDetail',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryDetail.fulfilled, (state, { payload }) => {
        return payload;
      })
      .addCase(createNewInventoryDetail.fulfilled, (state, { payload }) => {
        return payload;
      })
      .addCase(updateInventoryDetail.fulfilled, (state, { payload }) => {
        return payload;
      })
      .addCase(deleteInventoryDetail.fulfilled, () => {
        return {};
      });
  },
});

export const { setInventoryDetail, addInventoryDetail } = inventoryDetailSlice.actions;
export const inventoryDetailReducer = inventoryDetailSlice.reducer;
