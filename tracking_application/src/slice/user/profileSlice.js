import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfileAPI, updateProfileAPI } from "../../api/user/profileAPI";

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      return await getProfileAPI(userId);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to load profile";
      return rejectWithValue(message);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, payload }, { rejectWithValue }) => {
    try {
      return await updateProfileAPI(userId, payload);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to update profile";
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  profile: null,
  loading: false,
  updating: false,
  error: "",
  successMessage: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileMessage: (state) => {
      state.error = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to load profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updating = true;
        state.error = "";
        state.successMessage = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updating = false;
        state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
        state.successMessage = action.payload?.message || "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || action.error?.message || "Failed to update profile";
      });
  },
});

export const { clearProfileMessage } = profileSlice.actions;
export default profileSlice.reducer;


