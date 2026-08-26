import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Async thunks
export const fetchAlertProducts = createAsyncThunk(
  "products/fetchAlertProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/products/alerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch alert products");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ limit = 10, offset = 0, filters = {} } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const queryParams = new URLSearchParams({
        limit,
        offset,
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.stockStatus && { stockStatus: filters.stockStatus }),
      });

      const response = await fetch(
        `${API_URL}/api/admin/products?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return {
        products: data.data,
        total: data.pagination?.total || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create product");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  total: 0,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      // Handle both array (legacy) and object with products and total
      if (Array.isArray(action.payload)) {
        state.products = action.payload;
      } else {
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
      }
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Get product by ID
    builder.addCase(getProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    });
    builder.addCase(getProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.unshift(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(
        (prod) => prod.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (prod) => prod.id !== action.payload.id
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch alert products
    builder.addCase(fetchAlertProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAlertProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload || [];
    });
    builder.addCase(fetchAlertProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;
