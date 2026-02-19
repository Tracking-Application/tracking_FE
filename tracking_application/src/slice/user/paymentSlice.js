import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOrderAPI } from "../../api/user/paymentAPI";

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createOrderAPI(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.detail || "Order creation failed");
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  orderId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.orderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderId = action.payload.order_id;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
