"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ReviewCard from "./ReviewCard";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { getReviewsApi } from "@/store/api/adminReviewsApi";
import {
  fetchReviews,
  approveReview,
  rejectReview,
  clearError,
  clearSuccess,
  selectReviews,
  selectLoading,
  selectActionLoading,
  selectError,
  selectSuccessMessage,
} from "@/store/slices/adminReviewsSlice";

export default function ReviewsManager() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("pending");
  const [tabCounts, setTabCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const itemsPerPage = 12;

  // Fetch all tab counts on page load
  useEffect(() => {
    const fetchAllTabCounts = async () => {
      try {
        const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
          getReviewsApi("pending", 1, 0),
          getReviewsApi("approved", 1, 0),
          getReviewsApi("rejected", 1, 0),
        ]);

        setTabCounts({
          pending: pendingResult.pagination?.total || 0,
          approved: approvedResult.pagination?.total || 0,
          rejected: rejectedResult.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Failed to fetch tab counts:", error);
      }
    };

    fetchAllTabCounts();
  }, []);

  // Fetch reviews for the selected tab
  useEffect(() => {
    dispatch(fetchReviews({ tab: filter, limit: 100, offset: 0 }));
  }, [filter, dispatch]);

  // Handle approve - update UI immediately and refresh tab counts
  const handleAccept = async (reviewId) => {
    try {
      await dispatch(approveReview(reviewId)).unwrap();

      // Update tab counts immediately
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        getReviewsApi("pending", 1, 0),
        getReviewsApi("approved", 1, 0),
        getReviewsApi("rejected", 1, 0),
      ]);

      setTabCounts({
        pending: pendingResult.pagination?.total || 0,
        approved: approvedResult.pagination?.total || 0,
        rejected: rejectedResult.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  // Handle reject - update UI immediately and refresh tab counts
  const handleReject = async (reviewId) => {
    try {
      await dispatch(rejectReview(reviewId)).unwrap();

      // Update tab counts immediately
      const [pendingResult, approvedResult, rejectedResult] = await Promise.all([
        getReviewsApi("pending", 1, 0),
        getReviewsApi("approved", 1, 0),
        getReviewsApi("rejected", 1, 0),
      ]);

      setTabCounts({
        pending: pendingResult.pagination?.total || 0,
        approved: approvedResult.pagination?.total || 0,
        rejected: rejectedResult.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Failed to reject review:", error);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        if (successMessage) dispatch(clearSuccess());
        if (error) dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Reviews are already filtered by the selected tab (fetched from backend)
  const displayedReviews = reviews;

  // Calculate pagination
  const totalPages = Math.ceil(displayedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = displayedReviews.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    pending: tabCounts.pending,
    approved: tabCounts.approved,
    rejected: tabCounts.rejected,
    total: tabCounts.pending + tabCounts.approved + tabCounts.rejected,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-normal text-gray-900">Customer Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage and moderate customer reviews
        </p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">✓ {successMessage}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">✕ {error}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setFilter("pending")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
            filter === "pending"
              ? "border-[#430121] text-[#430121]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          ⏳ Pending ({stats.pending})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
            filter === "approved"
              ? "border-[#430121] text-[#430121]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          ✓ Approved ({stats.approved})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
            filter === "rejected"
              ? "border-[#430121] text-[#430121]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          ✕ Rejected ({stats.rejected})
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">Pending Reviews</p>
          <p className="text-3xl font-light text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">Total Reviews</p>
          <p className="text-3xl font-light text-blue-800">{stats.total}</p>
        </div>
      </div>

      {/* Pagination Info */}
      {displayedReviews.length > 0 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, displayedReviews.length)} of{" "}
            {displayedReviews.length}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Reviews Grid */}
      {loading ? (
        <SkeletonLoader type="card" count={6} />
      ) : paginatedReviews.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onAccept={handleAccept}
              onReject={handleReject}
              loading={actionLoading === review.id}
              filter={filter}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">
            No {filter} reviews
          </p>
          <p className="text-gray-500 text-sm mt-1">
            {filter === "pending"
              ? "All reviews have been moderated"
              : `No ${filter} reviews yet`}
          </p>
        </div>
      )}
    </div>
  );
}
