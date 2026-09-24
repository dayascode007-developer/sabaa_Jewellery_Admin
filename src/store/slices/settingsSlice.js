import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found");
        return rejectWithValue("No admin token found");
      }

      console.log("Fetching from URL:", `${API_URL}/api/admin/settings`);
      const response = await fetch(`${API_URL}/api/admin/notifications/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Settings fetch error - status:", response.status, "data:", errorData);
        throw new Error(errorData?.message || `HTTP ${response.status}: Failed to fetch settings`);
      }

      const data = await response.json();
      console.log("Settings fetched successfully:", data.data);
      return data.data;
    } catch (error) {
      console.error("Settings thunk error:", error.message);
      return rejectWithValue(error.message || "Failed to fetch settings");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    notificationsEnabled: true,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationsEnabled = action.payload?.notificationsEnabled ?? true;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
