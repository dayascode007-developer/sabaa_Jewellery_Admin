import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchUnboxing = createAsyncThunk(
  "unboxing/fetchUnboxing",
  async ({ limit = 50, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/unboxing?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch unboxing videos");
      const data = await response.json();
      return {
        unboxings: data.data,
        total: data.pagination?.total || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUnboxing = createAsyncThunk(
  "unboxing/createUnboxing",
  async (unboxingData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/unboxing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unboxingData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create unboxing video");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUnboxing = createAsyncThunk(
  "unboxing/updateUnboxing",
  async ({ id, unboxingData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/unboxing/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(unboxingData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update unboxing video");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUnboxing = createAsyncThunk(
  "unboxing/deleteUnboxing",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/unboxing/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete unboxing video");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const unboxingSlice = createSlice({
  name: "unboxing",
  initialState: {
    data: [],
    loading: false,
    error: null,
    total: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch unboxing videos
    builder.addCase(fetchUnboxing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUnboxing.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload.unboxings;
      state.total = action.payload.total;
    });
    builder.addCase(fetchUnboxing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create unboxing video
    builder.addCase(createUnboxing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUnboxing.fulfilled, (state, action) => {
      state.loading = false;
      state.data.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(createUnboxing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update unboxing video
    builder.addCase(updateUnboxing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUnboxing.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.data.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    });
    builder.addCase(updateUnboxing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete unboxing video
    builder.addCase(deleteUnboxing.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUnboxing.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((item) => item.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    });
    builder.addCase(deleteUnboxing.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = unboxingSlice.actions;
export default unboxingSlice.reducer;
