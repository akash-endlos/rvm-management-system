import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllStocksApi,
  createStockApi,
  getStockApi,
  deleteStockApi,
  updateStockApi,
} from '../api/stockApi';

export const fetchAllStocks = createAsyncThunk(
  'stocks/fetchAll',
  async () => {
    try {
      const response = await getAllStocksApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewStock = createAsyncThunk(
  'stocks/create',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await createStockApi(stockData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStock = createAsyncThunk(
  'stocks/fetchOne',
  async (stockId, { rejectWithValue }) => {
    try {
      const response = await getStockApi(stockId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStock = createAsyncThunk(
  'stocks/delete',
  async (stockId, { rejectWithValue }) => {
    try {
      await deleteStockApi(stockId);
      return stockId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'stocks/update',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await updateStockApi(stockData.id, stockData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const stockSlice = createSlice({
  name: 'stocks',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStocks.fulfilled, (state, action) => {
        console.log(action);
        const stocksWithIndex = action.payload.payload.stock.map((stock, index) => ({
          ...stock,
          index: index + 1,
        }));
        return stocksWithIndex;
      })
      .addCase(createNewStock.fulfilled, (state, { payload }) => {
        const newStock = {
          ...payload,
          index: 1,
        };
        const updatedState = state.map((stock) => ({
          ...stock,
          index: stock.index + 1,
        }));
        state.unshift(newStock);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteStock.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((stock) => stock._id !== payload);
        const stocksWithUpdatedIndex = updatedState.map((stock, index) => ({
          ...stock,
          index: index + 1,
        }));
        return stocksWithUpdatedIndex;
      })
      .addCase(updateStock.fulfilled, (state, { payload }) => {
        const updatedStock = payload;
        const updatedIndex = state.findIndex((stock) => stock._id === updatedStock._id);
        if (updatedIndex !== -1) {
          state[updatedIndex] = {
            ...updatedStock,
            index: state[updatedIndex].index,
          };
        }
      });
  },
});

export const stockReducer = stockSlice.reducer;
export const { setStocks, addStock } = stockSlice.actions;
