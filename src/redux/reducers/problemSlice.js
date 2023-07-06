import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllProblemsApi, createProblemApi, getProblemApi, deleteProblemApi, updateProblemApi } from '../api/problemApi';

export const fetchAllProblems = createAsyncThunk(
  'problems/fetchAll',
  async () => {
    const response = await getAllProblemsApi();
    return response;
  }
);

export const createNewProblem = createAsyncThunk(
  'problems/create',
  async (problemData) => {
    const response = await createProblemApi(problemData);
    return response;
  }
);

export const fetchProblem = createAsyncThunk(
  'problems/fetchOne',
  async (problemId) => {
    const response = await getProblemApi(problemId);
    return response;
  }
);

export const deleteProblem = createAsyncThunk(
  'problems/delete',
  async (problemId) => {
    console.log(problemId._id);
    await deleteProblemApi(problemId._id);
    return problemId;
  }
);

export const updateProblem = createAsyncThunk(
  'problems/update',
  async (problemData) => {
    const response = await updateProblemApi(problemData.id, { name: problemData.name });
    return response;
  }
);

const problemSlice = createSlice({
  name: 'problems',
  initialState: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProblems.fulfilled, (state, action) => {
        const problemsWithIndex = action.payload.payload.problems.map((problem, index) => ({
          ...problem,
          index: index + 1,
        }));
        return problemsWithIndex;
      })
      .addCase(createNewProblem.fulfilled, (state, { payload }) => {
        const newProblem = {
          ...payload.payload.Problem,
          index: 1,
        };
        const updatedState = state.map((problem) => ({
          ...problem,
          index: problem.index + 1,
        }));
        state.unshift(newProblem);
        state.length = updatedState.length + 1;
        state.splice(1, updatedState.length, ...updatedState);
      })
      .addCase(deleteProblem.fulfilled, (state, { payload }) => {
        const updatedState = state.filter((problem) => problem._id !== payload._id);
        const problemsWithUpdatedIndex = updatedState.map((problem, index) => ({
          ...problem,
          index: index + 1,
        }));
        return problemsWithUpdatedIndex;
      })
      .addCase(updateProblem.fulfilled, (state, { payload }) => {
        const updatedProblem = payload.payload.updatedProblem;
        const updatedIndex = state.findIndex((problem) => problem._id === updatedProblem._id);
        if (updatedIndex !== -1) {
          const newState = [...state]; // Create a new array
          newState[updatedIndex] = {
            ...updatedProblem,
            index: state[updatedIndex].index // Keep the existing index
          };
          return newState;
        }
        return state;
      });
  },
});

export const { setProblems, addProblem } = problemSlice.actions;
export const problemReducer = problemSlice.reducer;
