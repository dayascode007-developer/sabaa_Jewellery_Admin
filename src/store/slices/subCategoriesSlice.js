import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ===== SUB MAIN CATEGORIES (Level 2) Async Thunks =====
export const fetchSubMainCategories = createAsyncThunk(
  "subCategories/fetchSubMainCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/subcategories/sub-main`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sub main categories");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSubMainCategoriesByCategory = createAsyncThunk(
  "subCategories/fetchSubMainCategoriesByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/sub-main/category/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sub main categories");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSubMainCategory = createAsyncThunk(
  "subCategories/createSubMainCategory",
  async (subMainCategoryData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/subcategories/sub-main`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subMainCategoryData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create sub main category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSubMainCategory = createAsyncThunk(
  "subCategories/updateSubMainCategory",
  async ({ id, subMainCategoryData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/sub-main/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subMainCategoryData),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update sub main category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSubMainCategory = createAsyncThunk(
  "subCategories/deleteSubMainCategory",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/sub-main/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete sub main category");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ===== SUB CATEGORIES (Level 3) Async Thunks =====
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

export const fetchSubCategoriesBySubMainCategory = createAsyncThunk(
  "subCategories/fetchSubCategoriesBySubMainCategory",
  async (subMainCategoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/subcategories/sub-main/${subMainCategoryId}`,
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
  subMainCategories: [],
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
    // ===== SUB MAIN CATEGORIES (Level 2) Reducers =====
    // Fetch sub main categories
    builder.addCase(fetchSubMainCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubMainCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.subMainCategories = action.payload;
    });
    builder.addCase(fetchSubMainCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch sub main categories by category
    builder.addCase(fetchSubMainCategoriesByCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubMainCategoriesByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subMainCategories = action.payload;
    });
    builder.addCase(fetchSubMainCategoriesByCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create sub main category
    builder.addCase(createSubMainCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSubMainCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subMainCategories.unshift(action.payload);
    });
    builder.addCase(createSubMainCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update sub main category
    builder.addCase(updateSubMainCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateSubMainCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.subMainCategories.findIndex(
        (sub) => sub.id === action.payload.id
      );
      if (index !== -1) {
        state.subMainCategories[index] = action.payload;
      }
    });
    builder.addCase(updateSubMainCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete sub main category
    builder.addCase(deleteSubMainCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteSubMainCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subMainCategories = state.subMainCategories.filter(
        (sub) => sub.id !== action.payload.id
      );
    });
    builder.addCase(deleteSubMainCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ===== SUB CATEGORIES (Level 3) Reducers =====
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

    // Fetch sub categories by sub main category
    builder.addCase(fetchSubCategoriesBySubMainCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubCategoriesBySubMainCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.subCategories = action.payload;
    });
    builder.addCase(fetchSubCategoriesBySubMainCategory.rejected, (state, action) => {
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
