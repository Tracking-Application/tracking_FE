import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import loginAPI from "../../api/common/loginAPI";

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await loginAPI(payload);
      return response;
    } catch (error) {
      const detail = error?.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).join(", ")
        : detail || error?.response?.data?.message || "Login failed";

      return rejectWithValue(message);
    }
  },
);

const initialState = {
  loading: false,
  success: !!localStorage.getItem("userId"), // Check if user was logged in
  error: null,
  message: "",
  role: localStorage.getItem("role") || "",
  userId: localStorage.getItem("userId") || null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
      state.role = "";
      state.userId = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.message = action.payload?.message || "Login successful";
        state.role = action.payload?.role || "customer";
        state.userId = action.payload?.userId ?? null;
        
        // Persist to localStorage
        if (state.userId) {
          localStorage.setItem("userId", state.userId);
          localStorage.setItem("role", state.role);
          
          // Fix for ProtectedRoute compatibility
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              userId: state.userId,
              role: state.role,
              email: action.payload?.email || "",
              name: action.payload?.name || "User",
            })
          );
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error?.message || "Login failed";
      });
  },
});

export const { clearLoginState } = loginSlice.actions;
export default loginSlice.reducer;

