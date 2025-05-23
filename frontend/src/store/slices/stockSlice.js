import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const getAllStocks = createAsyncThunk(
  "stocks/getAllStocks",
  async ({ page = 1, search = "", sector = "", industry = "" }) => {
    const response = await api.get("/stocks", {
      params: {
        page,
        search,
        sector,
        industry,
      },
    });
    return response.data;
  }
);

const stockSlice = createSlice({
  name: "stocks",
  initialState: {
    stocks: [],
    loading: false,
    error: null,
    totalStocks: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStocks.fulfilled, (state, action) => {
        state.stocks = action.payload.stocks;
        state.totalStocks = action.payload.totalStocks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.itemsPerPage;
        state.loading = false;
      })
      .addCase(getAllStocks.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default stockSlice.reducer;
