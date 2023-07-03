import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomersApi, createCustomerApi, getCustomerApi, updateCustomerApi, deleteCustomerApi } from '../api/customerApi';

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
        console.log(state);
        return state;
      })
      .addCase(createNewCustomer.fulfilled, (state, action) => {
        const newCustomer = action.payload.payload.Customer;
        console.log(newCustomer);
        console.log(state);
        return [action.payload, ...state];
      })         
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        // Handle updating specific customer data in state
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const { customerId, customerData } = action.payload;
        return state.map((customer) => {
          if (customer.id === customerId) {
            return { id: customerId, ...customerData };
          }
          return customer;
        });
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        const customerId = action.payload;
        return state.filter((customer) => customer.id !== customerId);
      });
  },
});


export const customerActions = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
