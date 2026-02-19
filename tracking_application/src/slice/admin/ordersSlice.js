import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminOrders, updateOrderStatus } from "../../api/admin/ordersAPI";

export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (adminId, { rejectWithValue }) => {
    try {
      const data = await getAdminOrders(adminId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to fetch orders");
    }
  }
);

export const updateOrder = createAsyncThunk(
  "adminOrders/updateOrder",
  async ({ adminId, orderId, status }, { rejectWithValue, dispatch }) => {
    try {
      const data = await updateOrderStatus(adminId, orderId, status);
      // Refresh the orders list after update
      dispatch(fetchAllOrders(adminId));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || "Failed to update order status");
    }
  }
);

const ordersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
