import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://192.168.29.163:5000";

// Async Thunk for login
export const loginAdmin = createAsyncThunk(
  "adminAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data.data; // { token, admin: { id, email, name, role } }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for logout
export const logoutAdmin = createAsyncThunk(
  "adminAuth/logout",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Logout failed");
      }

      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for fetching admin details
export const fetchAdminDetails = createAsyncThunk(
  "adminAuth/fetchDetails",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/details`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to fetch details");
      }

      return data.data.admin;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  admin: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isHydrated: false,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    // Load admin from localStorage
    loadAdminFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("adminToken");
        const adminData = localStorage.getItem("adminData");

        console.log("🔄 Hydrating from localStorage...");
        if (token && adminData) {
          state.token = token;
          state.admin = JSON.parse(adminData);
          state.isAuthenticated = true;
          console.log("✅ Hydrated successfully");
        } else {
          console.log("❌ No data in localStorage");
        }
      }
      state.isHydrated = true;
    },
    // Clear auth state
    clearAuth: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.isAuthenticated = true;

        // Store in localStorage
        console.log("💾 Saving to localStorage...");
        localStorage.setItem("adminToken", action.payload.token);
        localStorage.setItem("adminData", JSON.stringify(action.payload.admin));
        console.log("✅ Saved:", { token: action.payload.token, admin: action.payload.admin });
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logoutAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;

        // Clear localStorage
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Admin Details
    builder
      .addCase(fetchAdminDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { loadAdminFromStorage, clearAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
