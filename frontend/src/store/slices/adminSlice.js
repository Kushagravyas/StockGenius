import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Async thunks
export const allUsers = createAsyncThunk(
  "admin/allUsers",
  async ({ search = "", role = "", page = 1, limit = 10 }) => {
    const response = await api.get("/admin/users", {
      params: { search, role, page, limit }
    });
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId) => {
    await api.delete(`/admin/users/${userId}`);
    return userId;
  }
);

export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async ({ userId, role }) => {
    const response = await api.post("/admin/users", { userId, role });
    return response.data;
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,
  itemsPerPage: 10
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(allUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.itemsPerPage;
      })
      .addCase(allUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        state.users = state.users.map(user => 
          user._id === updatedUser._id ? updatedUser : user
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
