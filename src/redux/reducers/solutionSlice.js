import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllSolutionsApi, createSolutionApi, getSolutionApi, deleteSolutionApi, updateSolutionApi } from '../api/solutionApi';

export const fetchAllSolutions = createAsyncThunk(
  'solutions/fetchAll',
  async () => {
    try {
      const response = await getAllSolutionsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewSolution = createAsyncThunk(
  'solutions/create',
  async (solutionData, { rejectWithValue }) => {
    try {
      const response = await createSolutionApi(solutionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSolution = createAsyncThunk(
  'solutions/fetchOne',
  async (solutionId, { rejectWithValue }) => {
    try {
      const response = await getSolutionApi(solutionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSolution = createAsyncThunk(
  'solutions/delete',
  async (solutionId, { rejectWithValue }) => {
    try {
      await deleteSolutionApi(solutionId);
      return solutionId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSolution = createAsyncThunk(
  'solutions/update',
  async (solutionData, { rejectWithValue }) => {
    try {
      const response = await updateSolutionApi(solutionData.id, { name: solutionData.name });
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

const solutionSlice = createSlice({
  name: 'solutions',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSolutions.fulfilled, (state, action) => {
        const solutionsWithIndex = action.payload.payload.solutions.map((solution, index) => ({
          ...solution,
          index: index + 1,
        }));
        return solutionsWithIndex;
      })
      .addCase(createNewSolution.fulfilled, (state, { payload }) => {
        const newSolution = {
          ...payload.payload.Solution,
          index: 1,
        };
        const updatedState = state.map((solution) => ({
          ...solution,
          index: solution.index + 1,
        }));
        state.unshift(newSolution);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteSolution.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((solution) => solution._id !== payload._id);
        const solutionsWithUpdatedIndex = updatedState.map((solution, index) => ({
          ...solution,
          index: index + 1,
        }));
        return solutionsWithUpdatedIndex;
      })
      .addCase(updateSolution.fulfilled, (state, { payload }) => {
        const updatedSolution = payload.payload.updatedSolution;
        const updatedIndex = state.findIndex((solution) => solution._id === updatedSolution._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedSolution,
            index: state[updatedIndex].index // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const { setSolutions, addSolution } = solutionSlice.actions;
export const solutionReducer = solutionSlice.reducer;
