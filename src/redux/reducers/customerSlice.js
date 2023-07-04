import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomersApi, createCustomerApi, getCustomerApi, deleteCustomerApi, updateCustomerApi } from '../api/customerApi';

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
export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (customerId) => {
    console.log(customerId._id);
    await deleteCustomerApi(customerId._id);
    return customerId;
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async (customerData) => {
    const response = await updateCustomerApi(customerData.id,{name:customerData.name});
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
          index: index + 1,
        }));
        return customersWithIndex;
      })
      .addCase(createNewCustomer.fulfilled, (state, { payload }) => {
        const newCustomer = {
          ...payload.payload.Customer,
          index: state.length + 1,
        };
        state.push(newCustomer);
      })
      .addCase(deleteCustomer.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((customer) => customer._id !== payload._id);
        const customersWithUpdatedIndex = updatedState.map((customer, index) => ({
          ...customer,
          index: index + 1,
        }));
        return customersWithUpdatedIndex;
      })
      .addCase(updateCustomer.fulfilled, (state, { payload }) => {
        const updatedCustomer = payload.payload.updatedCustomer;
        const updatedIndex = state.findIndex((customer) => customer._id === updatedCustomer._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedCustomer,
            index: state[updatedIndex].index // Keep the existing index
          };
          return newState;
        }
        return state;
      })
      
      
  },
});


export const { setCustomers, addCustomer } = customerSlice.actions;
export const customerReducer = customerSlice.reducer;
