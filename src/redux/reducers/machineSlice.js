import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllMachinesApi, createMachineApi, getMachineApi, deleteMachineApi, updateMachineApi } from '../api/machineApi';

export const fetchAllMachines = createAsyncThunk(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllMachinesApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewMachine = createAsyncThunk(
  'machines/create',
  async (machineData, { rejectWithValue }) => {
    try {
      const response = await createMachineApi(machineData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMachine = createAsyncThunk(
  'machines/fetchOne',
  async (machineId, { rejectWithValue }) => {
    try {
      const response = await getMachineApi(machineId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMachine = createAsyncThunk(
  'machines/delete',
  async (machineId, { rejectWithValue }) => {
    try {
      await deleteMachineApi(machineId._id);
      return machineId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateMachine = createAsyncThunk(
  'machines/update',
  async (machineData, { rejectWithValue }) => {
    try {
      const response = await updateMachineApi(machineData.id, { name: machineData.name });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const machineSlice = createSlice({
  name: 'machines',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMachines.fulfilled, (state, action) => {
        const machinesWithIndex = action.payload.payload.AllMachines.map((machine, index) => ({
          ...machine,
          index: index + 1,
        }));
        return machinesWithIndex;
      })
      .addCase(createNewMachine.fulfilled, (state, { payload }) => {
        const newMachine = {
          ...payload.payload.Machine,
          index: 1,
        };
        const updatedState = state.map((machine) => ({
          ...machine,
          index: machine.index + 1,
        }));
        state.unshift(newMachine);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteMachine.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((machine) => machine._id !== payload._id);
        const machinesWithUpdatedIndex = updatedState.map((machine, index) => ({
          ...machine,
          index: index + 1,
        }));
        return machinesWithUpdatedIndex;
      })
      .addCase(updateMachine.fulfilled, (state, { payload }) => {
        const updatedMachine = payload.payload.updatedMachine;
        const updatedIndex = state.findIndex((machine) => machine._id === updatedMachine._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedMachine,
            index: state[updatedIndex].index // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const machineReducer = machineSlice.reducer;
export const { setMachines, addMachine } = machineSlice.actions;
