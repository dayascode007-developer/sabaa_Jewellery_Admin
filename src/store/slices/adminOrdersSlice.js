import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrdersApi, getOrderStatsApi } from "../api/admOrdersApi";

export const fetchOrders = createAsyncThunk(
  "adminOrders/fetchOrders",
  async (
    {
      limit = 10,
      offset = 0,
      filters = {},
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getOrdersApi(limit, offset, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderStats = createAsyncThunk(
  "adminOrders/fetchOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const stats = await getOrderStatsApi();
      return stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState: {
    list: [],
    pagination: {
      total: 0,
      limit: 10,
      offset: 0,
      hasMore: false,
    },
    stats: {},
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrders: (state) => {
      state.list = [];
      state.pagination = {
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || [];
        state.pagination = action.payload.pagination || {
          total: 0,
          limit: 10,
          offset: 0,
          hasMore: false,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload || {};
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, resetOrders } = adminOrdersSlice.actions;
export default adminOrdersSlice.reducer;
