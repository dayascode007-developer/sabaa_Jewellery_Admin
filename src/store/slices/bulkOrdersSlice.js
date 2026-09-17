import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { exportOrdersApi, importOrdersApi } from "../api/bulkOrdersApi";

export const exportOrdersExcel = createAsyncThunk(
  "bulkOrders/exportExcel",
  async (_, { rejectWithValue }) => {
    try {
      const result = await exportOrdersApi();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const importOrdersExcel = createAsyncThunk(
  "bulkOrders/importExcel",
  async (file, { rejectWithValue }) => {
    try {
      const result = await importOrdersApi(file);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bulkOrdersSlice = createSlice({
  name: "bulkOrders",
  initialState: {
    loading: false,
    error: null,
    importResult: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearResult: (state) => {
      state.importResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Export
      .addCase(exportOrdersExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportOrdersExcel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportOrdersExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Import
      .addCase(importOrdersExcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(importOrdersExcel.fulfilled, (state, action) => {
        state.loading = false;
        state.importResult = action.payload;
      })
      .addCase(importOrdersExcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearResult } = bulkOrdersSlice.actions;
export default bulkOrdersSlice.reducer;
