import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getInventoryDetailsApi,
  createInventoryDetailApi,
  updateInventoryDetailApi,
  deleteInventoryDetailApi,
  getUnAssignedInventoryDetailsApi,
  getInventoryDetailByBrandIdApi
} from '../api/inventoryDetailApi';

// Async Thunks
export const fetchInventoryDetails = createAsyncThunk(
  'inventoryDetails/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInventoryDetailsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchUnAssignedInventoryDetails = createAsyncThunk(
  'inventoryDetails/fetchAllUnassigned',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUnAssignedInventoryDetailsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createInventoryDetail = createAsyncThunk(
  'inventoryDetails/create',
  async (inventoryDetailData, { rejectWithValue }) => {
    try {
      const response = await createInventoryDetailApi(inventoryDetailData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryDetail = createAsyncThunk(
  'inventoryDetails/update',
  async (inventoryDetailData, { rejectWithValue }) => {
    try {
      const response = await updateInventoryDetailApi(inventoryDetailData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInventoryDetail = createAsyncThunk(
  'inventoryDetails/delete',
  async (inventoryDetailId, { rejectWithValue }) => {
    try {
      await deleteInventoryDetailApi(inventoryDetailId);
      return inventoryDetailId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getInventoryDetailByBrandId = createAsyncThunk(
  'inventoryDetails/getByBrandId',
  async (inventoryBrandId, { rejectWithValue }) => {
    try {
      const response = await getInventoryDetailByBrandIdApi(inventoryBrandId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
      .addCase(fetchUnAssignedInventoryDetails.fulfilled, (state, action) => {
        console.log(action);
        const unassignedInventoryDetails = action.payload.payload.unAssignedInventry;
        const inventoryDetailsWithIndex = unassignedInventoryDetails.map((inventoryDetail, index) => ({
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
