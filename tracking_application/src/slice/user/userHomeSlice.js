import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductsAPI } from "../../api/user/userHomeAPI";

export const getProducts = createAsyncThunk(
  "userHome/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductsAPI();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const userHomeSlice = createSlice({
  name: "userHome",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userHomeSlice.reducer;
