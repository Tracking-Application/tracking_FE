import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAllProductsAPI,
  updateProductAPI,
  deleteProductAPI,
} from "../../api/admin/allProductsAPI";

// Thunk to fetch all products
export const fetchAllProducts = createAsyncThunk(
  "allProducts/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllProductsAPI();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Thunk to update a product
export const updateProduct = createAsyncThunk(
  "allProducts/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      return await updateProductAPI(productId, formData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update product"
      );
    }
  }
);

// Thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "allProducts/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProductAPI(productId);
      return productId; // Return ID to remove from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete product"
      );
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  updateSuccess: false,
  deleteSuccess: false,
};

const allProductsSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = true;
        // Update the product in the local list
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = {
            ...state.products[index],
            ...action.payload, // Merge updated fields
            // Ensure image_url is updated if returned
            image_url: action.payload.image_url || state.products[index].image_url
          }; 
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductStatus } = allProductsSlice.actions;
export default allProductsSlice.reducer;
