import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllInventoryBrandsApi,
  createInventoryBrandApi,
  getInventoryBrandApi,
  deleteInventoryBrandApi,
  updateInventoryBrandApi
} from '../api/inventoryBrandApi';

export const fetchAllInventoryBrands = createAsyncThunk(
  'inventoryBrands/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInventoryBrandsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewInventoryBrand = createAsyncThunk(
  'inventoryBrands/create',
  async (inventoryBrandData, { rejectWithValue }) => {
    try {
      const response = await createInventoryBrandApi(inventoryBrandData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInventoryBrand = createAsyncThunk(
  'inventoryBrands/fetchOne',
  async (inventoryBrandId, { rejectWithValue }) => {
    try {
      const response = await getInventoryBrandApi(inventoryBrandId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteInventoryBrand = createAsyncThunk(
  'inventoryBrands/delete',
  async (inventoryBrandId, { rejectWithValue }) => {
    try {
      await deleteInventoryBrandApi(inventoryBrandId._id);
      return inventoryBrandId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryBrand = createAsyncThunk(
  'inventoryBrands/update',
  async (inventoryBrandData, { rejectWithValue }) => {
    try {
      const response = await updateInventoryBrandApi(inventoryBrandData.id, { name: inventoryBrandData.name });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const inventoryBrandSlice = createSlice({
  name: 'inventoryBrands',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInventoryBrands.fulfilled, (state, action) => {
        const inventoryBrandsWithIndex = action.payload.payload.brands.map((inventoryBrand, index) => ({
          ...inventoryBrand,
          index: index + 1,
        }));
        return inventoryBrandsWithIndex;
      })
      .addCase(createNewInventoryBrand.fulfilled, (state, { payload }) => {
        const newInventoryBrand = {
          ...payload.payload.InventoryBrand,
          index: 1,
        };
        const updatedState = state.map((inventoryBrand) => ({
          ...inventoryBrand,
          index: inventoryBrand.index + 1,
        }));
        state.unshift(newInventoryBrand);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteInventoryBrand.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((inventoryBrand) => inventoryBrand._id !== payload._id);
        const inventoryBrandsWithUpdatedIndex = updatedState.map((inventoryBrand, index) => ({
          ...inventoryBrand,
          index: index + 1,
        }));
        return inventoryBrandsWithUpdatedIndex;
      })
      .addCase(updateInventoryBrand.fulfilled, (state, { payload }) => {
        const updatedInventoryBrand = payload.payload.brand;
        const updatedIndex = state.findIndex((inventoryBrand) => inventoryBrand._id === updatedInventoryBrand._id);
        if (updatedIndex !== -1) {
          const newState = [...state];
          newState[updatedIndex] = {
            ...updatedInventoryBrand,
            index: state[updatedIndex].index,
          };
          return newState;
        }
        return state;
      });
  },
});

export const { setInventoryBrands, addInventoryBrand } = inventoryBrandSlice.actions;
export const inventoryBrandReducer = inventoryBrandSlice.reducer;
