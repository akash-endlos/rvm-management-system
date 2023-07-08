import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCustomersApi, createCustomerApi, getCustomerApi, deleteCustomerApi, updateCustomerApi } from '../api/customerApi';

export const fetchAllCustomers = createAsyncThunk(
  'customers/fetchAll',
  async () => {
    try {
      const response = await getAllCustomersApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewCustomer = createAsyncThunk(
  'customers/create',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await createCustomerApi(customerData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomer = createAsyncThunk(
  'customers/fetchOne',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await getCustomerApi(customerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (customerId, { rejectWithValue }) => {
    try {
      await deleteCustomerApi(customerId._id);
      return customerId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);




export const updateCustomer = createAsyncThunk(
  'customers/update',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await updateCustomerApi(customerData.id, { name: customerData.name });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
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
          index: 1, 
        };
        const updatedState = state.map((customer) => ({
          ...customer,
          index: customer.index + 1, 
        }));
        state.unshift(newCustomer); 
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState); 
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
