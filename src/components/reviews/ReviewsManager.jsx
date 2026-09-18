"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ReviewCard from "./ReviewCard";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import {
  fetchPendingReviews,
  approveReview,
  rejectReview,
  clearError,
  clearSuccess,
  selectReviews,
  selectLoading,
  selectActionLoading,
  selectError,
  selectSuccessMessage,
  selectPagination,
} from "@/store/slices/adminReviewsSlice";

export default function ReviewsManager() {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviews);
  const loading = useSelector(selectLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectError);
  const successMessage = useSelector(selectSuccessMessage);
  const pagination = useSelector(selectPagination);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("pending");
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [rejectedReviews, setRejectedReviews] = useState([]);
  const itemsPerPage = 12;

  // Fetch reviews on component mount
  useEffect(() => {
    dispatch(fetchPendingReviews({ limit: 100, offset: 0 }));
  }, [dispatch]);

  // Handle approve - move to approved list
  const handleAccept = (reviewId) => {
    const approved = reviews.find((r) => r.id === reviewId);
    if (approved) {
      setApprovedReviews([...approvedReviews, { ...approved, is_approved: true }]);
    }
    dispatch(approveReview(reviewId));
  };

  // Handle reject - move to rejected list
  const handleReject = (reviewId) => {
    const rejected = reviews.find((r) => r.id === reviewId);
    if (rejected) {
      setRejectedReviews([...rejectedReviews, { ...rejected, is_approved: false }]);
    }
    dispatch(rejectReview(reviewId));
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

  // Filter reviews based on selected tab
  let displayedReviews = [];
  if (filter === "pending") {
    displayedReviews = reviews;
  } else if (filter === "approved") {
    displayedReviews = approvedReviews;
  } else if (filter === "rejected") {
    displayedReviews = rejectedReviews;
  }

  // Calculate pagination
  const totalPages = Math.ceil(displayedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = displayedReviews.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    pending: reviews.length,
    approved: approvedReviews.length,
    rejected: rejectedReviews.length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <SkeletonLoader type="card" count={6} />
      </div>
    );
  }

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
      {paginatedReviews.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {paginatedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onAccept={handleAccept}
              onReject={handleReject}
              loading={actionLoading === review.id}
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
