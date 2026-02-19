import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductDetailsAPI } from "../../api/user/productDetailsAPI";

export const getProductDetails = createAsyncThunk(
  "productDetails/getProductDetails",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getProductDetailsAPI(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  product: null,
  loading: false,
  error: null,
};

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productDetailsSlice.reducer;
