"use client";

import { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ReviewCard from "./ReviewCard";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const mockReviews = [
    {
      id: 1,
      customerName: "Priya Sharma",
      customerEmail: "priya@example.com",
      rating: 5,
      comment:
        "Amazing quality! The jewelry looks exactly as shown in the pictures. Very satisfied with my purchase.",
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      productName: "Gold Necklace Set",
    },
    {
      id: 2,
      customerName: "Rahul Verma",
      customerEmail: "rahul@example.com",
      rating: 4,
      comment:
        "Good quality, but delivery took a bit longer than expected. Product is nice though.",
      status: "pending",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      productName: "Silver Earrings",
    },
    {
      id: 3,
      customerName: "Anjali Patel",
      customerEmail: "anjali@example.com",
      rating: 3,
      comment: "Average. The color faded a bit after a few days.",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      productName: "Bracelet",
    },
    {
      id: 4,
      customerName: "Kavya Singh",
      customerEmail: "kavya@example.com",
      rating: 5,
      comment: "Perfect! Love it so much. Will definitely buy again.",
      status: "approved",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      productName: "Ring",
    },
  ];

  useEffect(() => {
    // Simulate loading reviews
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 500);
  }, []);

  const filteredReviews = reviews.filter((review) => review.status === filter);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAccept = async (reviewId) => {
    setActionLoading(reviewId);
    // Simulate API call
    setTimeout(() => {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, status: "approved" } : review
        )
      );
      setActionLoading(null);
    }, 500);
  };

  const handleReject = async (reviewId) => {
    setActionLoading(reviewId);
    // Simulate API call
    setTimeout(() => {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId ? { ...review, status: "rejected" } : review
        )
      );
      setActionLoading(null);
    }, 500);
  };

  const stats = {
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700 font-medium">Pending</p>
          <p className="text-3xl font-light text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700 font-medium">Approved</p>
          <p className="text-3xl font-light text-green-800">{stats.approved}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700 font-medium">Rejected</p>
          <p className="text-3xl font-light text-red-800">{stats.rejected}</p>
        </div>
      </div>

      {/* Pagination after Stats */}
      {filteredReviews.length > 0 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, filteredReviews.length)} of{" "}
            {filteredReviews.length}
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
            <MdChevronRight size={20} className="text-gray-600 " />
          </button>
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

      {/* Reviews List */}
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
          <p className="text-gray-600 text-lg">No {filter} reviews</p>
          <p className="text-gray-500 text-sm mt-1">
            Check back later for new reviews
          </p>
        </div>
      )}
    </div>
  );
}
