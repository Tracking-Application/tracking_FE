import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAllCustomersAPI } from "../../api/admin/usersAPI";

export const fetchAllCustomers = createAsyncThunk(
  "adminUsers/fetchAllCustomers",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllCustomersAPI();
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to fetch users";
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  users: [],
  loading: false,
  error: "",
};

const usersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload || [];
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch users";
      });
  },
});

export default usersSlice.reducer;
