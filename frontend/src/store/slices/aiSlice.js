import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const getAIAnalysis = createAsyncThunk(
  "ai/getAnalysis",
  async (symbol, { dispatch }) => {
    // Simulate step progression
    dispatch(setLoadingStep(0)); // AI is getting ready
    await new Promise((resolve) => setTimeout(resolve, 1000));

    dispatch(setLoadingStep(1)); // AI is fetching the data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    dispatch(setLoadingStep(2)); // AI is analyzing stock data
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await api.get(`/ai/suggest/${symbol}`);

    dispatch(setLoadingStep(3)); // AI is forming the report
    await new Promise((resolve) => setTimeout(resolve, 800));

    return response.data;
  }
);

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    analysis: null,
    loading: false,
    loadingStep: 0,
    error: null,
  },
  reducers: {
    clearAnalysis: (state) => {
      state.analysis = null;
      state.loading = false;
      state.loadingStep = 0;
      state.error = null;
    },
    setLoadingStep: (state, action) => {
      state.loadingStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAIAnalysis.pending, (state) => {
        state.loading = true;
        state.loadingStep = 0;
        state.error = null;
        state.analysis = null; // Clear previous analysis when loading new one
      })
      .addCase(getAIAnalysis.fulfilled, (state, action) => {
        state.analysis = action.payload;
        state.loading = false;
      })
      .addCase(getAIAnalysis.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { clearAnalysis, setLoadingStep } = aiSlice.actions;
export default aiSlice.reducer;
