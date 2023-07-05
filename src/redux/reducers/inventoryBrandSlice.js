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
  async () => {
    const response = await getAllInventoryBrandsApi();
    return response;
  }
);

export const createNewInventoryBrand = createAsyncThunk(
  'inventoryBrands/create',
  async (inventoryBrandData) => {
    const response = await createInventoryBrandApi(inventoryBrandData);
    return response;
  }
);

export const fetchInventoryBrand = createAsyncThunk(
  'inventoryBrands/fetchOne',
  async (inventoryBrandId) => {
    const response = await getInventoryBrandApi(inventoryBrandId);
    return response;
  }
);

export const deleteInventoryBrand = createAsyncThunk(
  'inventoryBrands/delete',
  async (inventoryBrandId) => {
    console.log(inventoryBrandId._id);
    await deleteInventoryBrandApi(inventoryBrandId._id);
    return inventoryBrandId;
  }
);

export const updateInventoryBrand = createAsyncThunk(
  'inventoryBrands/update',
  async (inventoryBrandData) => {
    const response = await updateInventoryBrandApi(inventoryBrandData.id, { name: inventoryBrandData.name });
    return response;
  }
);

const inventoryBrandSlice = createSlice({
  name: 'inventoryBrands',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInventoryBrands.fulfilled, (state, action) => {
        const inventoryBrandsWithIndex = action.payload.map((inventoryBrand, index) => ({
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
        const updatedInventoryBrand = payload.payload.updatedInventoryBrand;
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
