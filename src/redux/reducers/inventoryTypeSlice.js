import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllInventoryTypesApi,
  createInventoryTypeApi,
  getInventoryTypeApi,
  deleteInventoryTypeApi,
  updateInventoryTypeApi,
} from '../api/inventoryTypeApi';

export const fetchAllInventoryTypes = createAsyncThunk(
  'inventoryTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInventoryTypesApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewInventoryType = createAsyncThunk(
  'inventoryTypes/create',
  async (inventoryTypeData, { rejectWithValue }) => {
    try {
      const response = await createInventoryTypeApi(inventoryTypeData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInventoryType = createAsyncThunk(
  'inventoryTypes/fetchOne',
  async (inventoryTypeId, { rejectWithValue }) => {
    try {
      const response = await getInventoryTypeApi(inventoryTypeId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInventoryType = createAsyncThunk(
  'inventoryTypes/delete',
  async (inventoryTypeId, { rejectWithValue }) => {
    try {
      await deleteInventoryTypeApi(inventoryTypeId);
      return inventoryTypeId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryType = createAsyncThunk(
  'inventoryTypes/update',
  async (inventoryTypeData, { rejectWithValue }) => {
    try {
      const response = await updateInventoryTypeApi(inventoryTypeData.id, { name: inventoryTypeData.name });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const inventoryTypeSlice = createSlice({
  name: 'inventoryTypes',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInventoryTypes.fulfilled, (state, action) => {
        const inventoryTypesWithIndex = action.payload.payload.InventryTypes.map((inventoryType, index) => ({
          ...inventoryType,
          index: index + 1,
        }));
        return inventoryTypesWithIndex;
      })
      .addCase(createNewInventoryType.fulfilled, (state, { payload }) => {
        const newInventoryType = {
          ...payload.payload.Customer,
          index: 1,
        };
        const updatedState = state.map((inventoryType) => ({
          ...inventoryType,
          index: inventoryType.index + 1,
        }));
        state.unshift(newInventoryType);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(fetchInventoryType.fulfilled, (state, { payload }) => {
        const index = state.findIndex((inventoryType) => inventoryType._id === payload._id);
        if (index !== -1) {
          state[index] = {
            ...payload,
            index: state[index].index,
          };
        }
      })
      .addCase(deleteInventoryType.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((inventoryType) => inventoryType._id !== payload);
        const inventoryTypesWithUpdatedIndex = updatedState.map((inventoryType, index) => ({
          ...inventoryType,
          index: index + 1,
        }));
        return inventoryTypesWithUpdatedIndex;
      })
      .addCase(updateInventoryType.fulfilled, (state, { payload }) => {
        const updatedInventoryType = payload;
        const index = state.findIndex((inventoryType) => inventoryType._id === updatedInventoryType._id);
        if (index !== -1) {
          state[index] = updatedInventoryType;
        }
      });
  },
});

export const { setInventoryTypes, addInventoryType } = inventoryTypeSlice.actions;
export const inventoryTypeReducer = inventoryTypeSlice.reducer;
