import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Async thunks
export const fetchSubCategories = createAsyncThunk(
  "subCategories/fetchSubCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/subcategories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sub categories");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubCategoriesByCategory = createAsyncThunk(
  "subCategories/fetchSubCategoriesByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/category/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sub categories");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubCategory = createAsyncThunk(
  "subCategories/createSubCategory",
  async (subCategoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/subcategories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subCategoryData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create sub category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  "subCategories/updateSubCategory",
  async ({ id, subCategoryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subCategoryData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sub category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "subCategories/deleteSubCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete sub category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  subCategories: [],
  loading: false,
  error: null,
};

const subCategoriesSlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch sub categories
    builder.addCase(fetchSubCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.subCategories = action.payload;
    });
    builder.addCase(fetchSubCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch sub categories by category
    builder.addCase(fetchSubCategoriesByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubCategoriesByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subCategories = action.payload;
    });
    builder.addCase(fetchSubCategoriesByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create sub category
    builder.addCase(createSubCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSubCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subCategories.unshift(action.payload);
    });
    builder.addCase(createSubCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update sub category
    builder.addCase(updateSubCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSubCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.subCategories.findIndex(
        (sub) => sub.id === action.payload.id
      );
      if (index !== -1) {
        state.subCategories[index] = action.payload;
      }
    });
    builder.addCase(updateSubCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete sub category
    builder.addCase(deleteSubCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSubCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subCategories = state.subCategories.filter(
        (sub) => sub.id !== action.payload.id
      );
    });
    builder.addCase(deleteSubCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = subCategoriesSlice.actions;
export default subCategoriesSlice.reducer;
