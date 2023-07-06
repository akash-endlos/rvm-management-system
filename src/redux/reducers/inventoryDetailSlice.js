import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getInventoryDetailsApi,
  createInventoryDetailApi,
  updateInventoryDetailApi,
  deleteInventoryDetailApi
} from '../api/inventoryDetailApi';

// Async Thunks
export const fetchInventoryDetails = createAsyncThunk(
  'inventoryDetails/fetchAll',
  async () => {
    const response = await getInventoryDetailsApi();
    return response;
  }
);

export const createInventoryDetail = createAsyncThunk(
  'inventoryDetails/create',
  async (inventoryDetailData) => {
    const response = await createInventoryDetailApi(inventoryDetailData);
    return response;
  }
);

export const updateInventoryDetail = createAsyncThunk(
  'inventoryDetails/update',
  async (inventoryDetailData) => {
    const response = await updateInventoryDetailApi(inventoryDetailData);
    return response;
  }
);

export const deleteInventoryDetail = createAsyncThunk(
  'inventoryDetails/delete',
  async (inventoryDetailId) => {
    await deleteInventoryDetailApi(inventoryDetailId);
    return inventoryDetailId;
  }
);

// Slice
const inventoryDetailSlice = createSlice({
  name: 'inventoryDetails',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryDetails.fulfilled, (state, action) => {
        const inventoryDetailsWithIndex = action.payload.payload.allInventry.map((inventoryDetail, index) => ({
          ...inventoryDetail,
          index: index + 1,
        }));
        return inventoryDetailsWithIndex;
      })
      .addCase(createInventoryDetail.fulfilled, (state, action) => {
        const newInventoryDetail = {
          ...action.payload,
          index: 1,
        };
        const updatedState = state.map((inventoryDetail) => ({
          ...inventoryDetail,
          index: inventoryDetail.index + 1,
        }));
        state.unshift(newInventoryDetail);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(updateInventoryDetail.fulfilled, (state, action) => {
        const updatedInventoryDetail = action.payload;
        const updatedIndex = state.findIndex((inventoryDetail) => inventoryDetail.id === updatedInventoryDetail.id);
        if (updatedIndex !== -1) {
          const newState = [...state];
          newState[updatedIndex] = {
            ...updatedInventoryDetail,
            index: state[updatedIndex].index,
          };
          return newState;
        }
        return state;
      })
      .addCase(deleteInventoryDetail.fulfilled, (state, action) => {
        const updatedState = state.filter((inventoryDetail) => inventoryDetail.id !== action.payload);
        const inventoryDetailsWithUpdatedIndex = updatedState.map((inventoryDetail, index) => ({
          ...inventoryDetail,
          index: index + 1,
        }));
        return inventoryDetailsWithUpdatedIndex;
      });
  },
});

export default inventoryDetailSlice.reducer;
