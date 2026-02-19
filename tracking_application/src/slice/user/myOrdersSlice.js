import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMyOrders } from "../../api/user/myOrdersAPI";

export const getMyOrders = createAsyncThunk(
  "myOrders/getMyOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const data = await fetchMyOrders(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch orders");
    }
  }
);

const myOrdersSlice = createSlice({
  name: "myOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default myOrdersSlice.reducer;
