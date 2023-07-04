import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomersApi, createCustomerApi, getCustomerApi } from '../api/customerApi';

export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    const response = await getAllCustomersApi();
    return response;
  }
);

export const createNewCustomer = createAsyncThunk(
  'customers/create',
  async (customerData) => {
    const response = await createCustomerApi(customerData);
    return response;
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchOne',
  async (customerId) => {
    const response = await getCustomerApi(customerId);
    return response;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        return [...action.payload];
      })
      .addCase(createNewCustomer.fulfilled, (state, {payload}) => {
        state.push(payload.payload.Customer);
      })         
  },
});


export const { setCustomers, addCustomer } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
