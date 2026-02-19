import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import registerAPI from "../../api/common/registerAPI";

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerAPI(payload);
      return response;
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).join(", ")
        : detail || error?.response?.data?.message || "Registration failed";

      return rejectWithValue(message);
    }
  },
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",
  role: "customer",
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearRegisterState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload?.message || "Registered successfully";
        state.role = action.payload?.role || "customer";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Request failed";
      });
  },
});

export const { clearRegisterState } = registerSlice.actions;
export default registerSlice.reducer;

