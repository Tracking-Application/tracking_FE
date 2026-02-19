import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import addProductAPI from "../../api/admin/addProductAPI";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await addProductAPI(formData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to add product",
      );
    }
  },
);

const addProductSlice = createSlice({
  name: "addProduct",
  initialState: {
    loading: false,
    success: false,
    error: null,
    newProduct: null,
  },
  reducers: {
    resetProductState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.newProduct = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetProductState } = addProductSlice.actions;
export default addProductSlice.reducer;
