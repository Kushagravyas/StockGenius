import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const getWatchlist = createAsyncThunk("watchlist/getWatchlist", async () => {
  const response = await api.get("/watchlist");
  return response.data.watchlist;
});

export const toggleWatchlist = createAsyncThunk(
  "watchlist/toggleWatchlist",
  async ({ symbol, name }) => {
    const response = await api.post("/watchlist/toggle", { symbol, name });
    return response.data;
  }
);

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    watchlist: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWatchlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
        state.loading = false;
      })
      .addCase(getWatchlist.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(toggleWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload.watchlist;
      });
  },
});

export default watchlistSlice.reducer;
