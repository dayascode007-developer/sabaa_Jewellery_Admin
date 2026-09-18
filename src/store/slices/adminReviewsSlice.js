import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReviewsApi, getPendingReviewsApi, approveReviewApi, rejectReviewApi } from "../api/adminReviewsApi";

export const fetchReviews = createAsyncThunk(
  "adminReviews/fetchReviews",
  async ({ tab = "pending", limit = 20, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await getReviewsApi(tab, limit, offset);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPendingReviews = createAsyncThunk(
  "adminReviews/fetchPendingReviews",
  async ({ limit = 20, offset = 0 } = {}, { rejectWithValue }) => {
    try {
      const response = await getPendingReviewsApi(limit, offset);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveReview = createAsyncThunk(
  "adminReviews/approveReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await approveReviewApi(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectReview = createAsyncThunk(
  "adminReviews/rejectReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await rejectReviewApi(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminReviewsSlice = createSlice({
  name: "adminReviews",
  initialState: {
    reviews: [],
    pagination: {
      limit: 20,
      offset: 0,
      total: 0,
    },
    loading: false,
    actionLoading: null,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews (generic with tab parameter)
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || {
          limit: 20,
          offset: 0,
          total: 0,
        };
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pending reviews
      .addCase(fetchPendingReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
        state.pagination = action.payload.pagination || {
          limit: 20,
          offset: 0,
          total: 0,
        };
      })
      .addCase(fetchPendingReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Approve review
      .addCase(approveReview.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
        state.successMessage = "Review approved successfully";
      })
      .addCase(approveReview.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      })

      // Reject review
      .addCase(rejectReview.pending, (state, action) => {
        state.actionLoading = action.meta.arg;
      })
      .addCase(rejectReview.fulfilled, (state, action) => {
        state.actionLoading = null;
        state.reviews = state.reviews.filter((r) => r.id !== action.payload);
        state.successMessage = "Review rejected successfully";
      })
      .addCase(rejectReview.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = adminReviewsSlice.actions;

// Selectors
export const selectReviews = (state) => state.adminReviews.reviews;
export const selectLoading = (state) => state.adminReviews.loading;
export const selectActionLoading = (state) => state.adminReviews.actionLoading;
export const selectError = (state) => state.adminReviews.error;
export const selectSuccessMessage = (state) => state.adminReviews.successMessage;
export const selectPagination = (state) => state.adminReviews.pagination;

export default adminReviewsSlice.reducer;
