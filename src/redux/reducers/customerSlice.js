import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomersApi, createCustomerApi, getCustomerApi, updateCustomerApi, deleteCustomerApi } from '../api/customerApi';

export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    const response = await getAllCustomersApi();
    console.log(response.payload);
    return response.payload;
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

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ customerId, customerData }) => {
    const response = await updateCustomerApi(customerId, customerData);
    return { customerId, customerData };
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (customerId) => {
    await deleteCustomerApi(customerId);
    return customerId;
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createNewCustomer.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        // Handle updating specific customer data in state
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const { customerId, customerData } = action.payload;
        const customerIndex = state.findIndex((customer) => customer.id === customerId);
        if (customerIndex !== -1) {
          state[customerIndex] = { id: customerId, ...customerData };
        }
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        const customerId = action.payload;
        const customerIndex = state.findIndex((customer) => customer.id === customerId);
        if (customerIndex !== -1) {
          state.splice(customerIndex, 1);
        }
      });
  },
});

export const customerActions = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
