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
      const customersWithIndex = action.payload.map((customer, index) => ({
        ...customer,
        index: index + 1, // Adding index starting from 1
      }));
      return customersWithIndex;
    })
    .addCase(createNewCustomer.fulfilled, (state, { payload }) => {
      const newCustomer = {
        ...payload.payload.Customer,
        index: state.length + 1, // Calculate index based on the current length of the state array
      };
      state.push(newCustomer);
    });    
  },
});


export const { setCustomers, addCustomer } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
