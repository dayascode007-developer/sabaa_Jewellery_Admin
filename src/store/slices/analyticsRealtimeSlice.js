import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchRealtimeAnalytics = createAsyncThunk(
  "analyticsRealtime/fetchRealtimeAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/analytics/realtime`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch real-time analytics");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const analyticsRealtimeSlice = createSlice({
  name: "analyticsRealtime",
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearRealtimeError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRealtimeAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRealtimeAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchRealtimeAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRealtimeError } = analyticsRealtimeSlice.actions;
export default analyticsRealtimeSlice.reducer;
