import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const validateBulkUpload = createAsyncThunk(
  "bulkProducts/validate",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/admin/bulk-products/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Validation failed");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const confirmBulkUpload = createAsyncThunk(
  "bulkProducts/confirm",
  async (file, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/admin/bulk-products/confirm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downloadTemplate = createAsyncThunk(
  "bulkProducts/downloadTemplate",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/bulk-products/template/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download template");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Bulk-Upload-Template.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bulkProductsSlice = createSlice({
  name: "bulkProducts",
  initialState: {
    validationResults: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetValidation: (state) => {
      state.validationResults = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Validate bulk upload
    builder
      .addCase(validateBulkUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateBulkUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResults = action.payload;
        state.error = null;
      })
      .addCase(validateBulkUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Confirm bulk upload
    builder
      .addCase(confirmBulkUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmBulkUpload.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResults = {
          ...state.validationResults,
          confirmResult: action.payload,
        };
        state.error = null;
      })
      .addCase(confirmBulkUpload.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Download template
    builder
      .addCase(downloadTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadTemplate.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetValidation } = bulkProductsSlice.actions;
export default bulkProductsSlice.reducer;
