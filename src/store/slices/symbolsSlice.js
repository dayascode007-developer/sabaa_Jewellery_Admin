import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const uploadSymbol = createAsyncThunk(
  "symbols/uploadSymbol",
  async ({ symbolName, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("symbolName", symbolName.toLowerCase().trim());
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/admin/symbols/upload`, {
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

export const fetchSymbols = createAsyncThunk(
  "symbols/fetchSymbols",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/symbols`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch symbols");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  symbols: [],
  loading: false,
  uploading: false,
  error: null,
  uploadError: null,
};

const symbolsSlice = createSlice({
  name: "symbols",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUploadError: (state) => {
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch symbols
    builder.addCase(fetchSymbols.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSymbols.fulfilled, (state, action) => {
      state.loading = false;
      state.symbols = action.payload;
    });
    builder.addCase(fetchSymbols.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Upload symbol
    builder.addCase(uploadSymbol.pending, (state) => {
      state.uploading = true;
      state.uploadError = null;
    });
    builder.addCase(uploadSymbol.fulfilled, (state, action) => {
      state.uploading = false;
      state.symbols.push(action.payload);
    });
    builder.addCase(uploadSymbol.rejected, (state, action) => {
      state.uploading = false;
      state.uploadError = action.payload;
    });
  },
});

export const { clearError, clearUploadError } = symbolsSlice.actions;
export default symbolsSlice.reducer;
