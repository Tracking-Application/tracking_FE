import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminHomeAPI from "../../api/admin/adminHomeAPI";

export const fetchTotalOrders = createAsyncThunk(
  "adminHome/fetchTotalOrders",
  async (adminId, { rejectWithValue }) => {
    try {
      const data = await adminHomeAPI.getTotalOrdersAPI(adminId);
      return data.total_orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch total orders");
    }
  }
);

export const fetchTotalDelivered = createAsyncThunk(
  "adminHome/fetchTotalDelivered",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminHomeAPI.getTotalDeliveredOrdersAPI();
      return data.total_delivered;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch delivered orders");
    }
  }
);

export const fetchTotalPending = createAsyncThunk(
  "adminHome/fetchTotalPending",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminHomeAPI.getTotalPendingOrdersAPI();
      return data.total_pending;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch pending orders");
    }
  }
);

export const fetchTotalShipping = createAsyncThunk(
  "adminHome/fetchTotalShipping",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminHomeAPI.getTotalShippingOrdersAPI();
      return data.total_shipping;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch shipping orders");
    }
  }
);

const initialState = {
  totalOrders: 0,
  deliveredOrders: 0,
  pendingOrders: 0,
  shippingOrders: 0,
  loading: false,
  error: null,
};

const adminHomeSlice = createSlice({
  name: "adminHome",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchTotalOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.totalOrders = action.payload;
      })
      .addCase(fetchTotalOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTotalDelivered.fulfilled, (state, action) => {
        state.deliveredOrders = action.payload;
      })
      .addCase(fetchTotalPending.fulfilled, (state, action) => {
        state.pendingOrders = action.payload;
      })
      .addCase(fetchTotalShipping.fulfilled, (state, action) => {
        state.shippingOrders = action.payload;
      });
  },
});

export default adminHomeSlice.reducer;
