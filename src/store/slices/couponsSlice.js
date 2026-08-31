import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchCoupons = createAsyncThunk(
  "coupons/fetchCoupons",
  async ({ limit = 50, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/coupons?limit=${limit}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch coupons");
      const data = await response.json();
      return {
        coupons: data.data,
        total: data.pagination?.total || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCouponById = createAsyncThunk(
  "coupons/fetchCouponById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch coupon");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupons/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(couponData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create coupon");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupons/updateCoupon",
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(couponData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update coupon");
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupons/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete coupon");
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  coupons: [],
  currentCoupon: null,
  total: 0,
  loading: false,
  error: null,
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCoupons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCoupons.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload.coupons || [];
      state.total = action.payload.total || 0;
    });
    builder.addCase(fetchCoupons.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(fetchCouponById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCouponById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCoupon = action.payload;
    });
    builder.addCase(fetchCouponById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(createCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCoupon.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons.unshift(action.payload);
      state.total += 1;
    });
    builder.addCase(createCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(updateCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCoupon.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.coupons.findIndex(
        (coupon) => coupon.id === action.payload.id
      );
      if (index !== -1) {
        state.coupons[index] = action.payload;
      }
      if (state.currentCoupon?.id === action.payload.id) {
        state.currentCoupon = action.payload;
      }
    });
    builder.addCase(updateCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteCoupon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCoupon.fulfilled, (state, action) => {
      state.loading = false;
      const deletedId = action.payload.id || action.payload;
      state.coupons = state.coupons.filter(
        (coupon) => String(coupon.id) !== String(deletedId)
      );
      state.total -= 1;
      if (state.currentCoupon?.id === deletedId) {
        state.currentCoupon = null;
      }
    });
    builder.addCase(deleteCoupon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, clearCurrentCoupon } = couponsSlice.actions;
export default couponsSlice.reducer;
