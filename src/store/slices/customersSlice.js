import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Async thunks
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({ limit = 10, offset = 0, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        limit,
        offset,
        ...(filters.search && { search: filters.search }),
        ...(filters.month && { month: filters.month }),
      });

      const response = await fetch(
        `${API_URL}/api/admin/customers?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      return {
        customers: data.data,
        total: data.pagination?.total || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCustomerById = createAsyncThunk(
  "customers/getCustomerById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/customers/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch customer");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomersForDownload = createAsyncThunk(
  "customers/fetchCustomersForDownload",
  async ({ filters = {} } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        limit: 10000,
        offset: 0,
        ...(filters.search && { search: filters.search }),
        ...(filters.month && { month: filters.month }),
      });

      const response = await fetch(
        `${API_URL}/api/admin/customers?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch customers for download");
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  customers: [],
  currentCustomer: null,
  total: 0,
  loading: false,
  downloadLoading: false,
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch customers
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload.customers || [];
      state.total = action.payload.total || 0;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get customer by ID
    builder.addCase(getCustomerById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCustomerById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCustomer = action.payload;
    });
    builder.addCase(getCustomerById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch customers for download
    builder.addCase(fetchCustomersForDownload.pending, (state) => {
      state.downloadLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomersForDownload.fulfilled, (state) => {
      state.downloadLoading = false;
    });
    builder.addCase(fetchCustomersForDownload.rejected, (state, action) => {
      state.downloadLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearCurrentCustomer } = customersSlice.actions;
export default customersSlice.reducer;
