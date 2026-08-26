import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchInventoryStats = createAsyncThunk(
  "inventory/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/inventory/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (
    { page = 1, limit = 10, search = "", category = "all", status = "all" },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        search,
        category,
        status,
      });
      const response = await fetch(
        `${API_BASE}/api/admin/inventory?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch inventory");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateInventoryStock = createAsyncThunk(
  "inventory/updateStock",
  async ({ productId, stock, lowStockThreshold }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/admin/inventory/${productId}/stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({ stock, lowStockThreshold }),
        }
      );
      if (!response.ok) throw new Error("Failed to update stock");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  stats: {
    totalProducts: 0,
    criticalStock: 0,
    lowStock: 0,
    inStock: 0,
  },
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  loading: false,
  statsLoading: false,
  initialLoad: true,
  error: null,
  updateError: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Stats
    builder
      .addCase(fetchInventoryStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchInventoryStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchInventoryStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      });

    // Fetch Inventory
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.initialLoad = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.initialLoad = false;
        state.error = action.payload;
      });

    // Update Stock
    builder
      .addCase(updateInventoryStock.pending, (state) => {
        state.loading = true;
        state.updateError = null;
      })
      .addCase(updateInventoryStock.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.items[index] = {
            id: updatedItem.id,
            product: updatedItem.product,
            sku: updatedItem.sku,
            stock: updatedItem.stock,
            lowStockThreshold: updatedItem.lowStockThreshold,
            category: updatedItem.category,
            status: updatedItem.status,
          };
        }
      })
      .addCase(updateInventoryStock.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearError, clearUpdateError } = inventorySlice.actions;
export default inventorySlice.reducer;
