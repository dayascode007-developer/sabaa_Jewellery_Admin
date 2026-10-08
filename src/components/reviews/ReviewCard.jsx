"use client";

export default function ReviewCard({ review, onAccept, onReject, loading, filter = "pending" }) {
  const getStatusColor = (isApproved) => {
    return isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  const getStatusIcon = (isApproved) => {
    return isApproved ? "✓" : "⏳";
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < rating ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base font-medium text-gray-900">
            {review.customer_name}
          </h3>
          <p className="text-xs text-gray-500 truncate">
            {review.customer_email}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
            review.is_approved
          )}`}
        >
          {getStatusIcon(review.is_approved)}
        </span>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <div className="flex items-center gap-1">
          {renderStars(review.rating)}
          <span className="text-xs text-gray-600">{review.rating}/5</span>
        </div>
      </div>

      {/* Review Title */}
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-900">
          {review.review_title}
        </p>
      </div>

      {/* Review Text */}
      <div className="mb-3 flex-grow">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {review.review_text}
        </p>
      </div>

      {/* User Image Preview */}
      {review.user_img && (
        <div className="mb-3 rounded overflow-hidden bg-gray-100">
          <img
            src={review.user_img}
            alt="Customer photo"
            className="w-full h-24 object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      {/* Product Info */}
      {review.product_title && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-600 truncate">
            <span className="font-medium">📦</span> {review.product_title}
          </p>
        </div>
      )}

      {/* Date */}
      <div className="mb-3">
        <p className="text-xs text-gray-500">
          {new Date(review.created_at).toLocaleDateString("en-GB")}
        </p>
      </div>

      {/* Actions - Only show on pending tab */}
      {filter === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(review.id)}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            {loading ? "Loading.." : "✓ Accept"}
          </button>
          <button
            onClick={() => onReject(review.id)}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors cursor-pointer"
          >
            {loading ? "Loading.." : "✕ Reject"}
          </button>
        </div>
      )}

      {filter === "approved" && (
        <div className="p-2 bg-green-50 rounded text-center">
          <p className="text-xs text-green-700 font-medium">✓ Approved</p>
        </div>
      )}

      {filter === "rejected" && (
        <div className="p-2 bg-red-50 rounded text-center">
          <p className="text-xs text-red-700 font-medium">✕ Rejected</p>
        </div>
      )}
    </div>
  );
}
