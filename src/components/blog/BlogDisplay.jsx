"use client";

import { useState } from "react";
import { MdEdit, MdDelete, MdArrowBack } from "react-icons/md";
import SuccessModal from "@/components/modals/SuccessModal";

export default function BlogDisplay({ blog, onEdit, onDelete, onBack }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onDelete();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <MdArrowBack size={20} />
            <span>Back</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="Edit blog"
            >
              <MdEdit size={20} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Delete blog"
            >
              <MdDelete size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Blog Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Meta Information */}
        <div className="flex items-center gap-4 text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <span className="text-sm">{blog.publishedDate}</span>
        </div>

        {/* Main Image */}
        {(blog.main_image || blog.mainImage) && (
          <div className="mb-12">
            <img
              src={blog.main_image || blog.mainImage}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Description */}
        <p className="text-xl text-gray-700 leading-relaxed mb-12">
          {blog.description}
        </p>

        {/* Content Sections */}
        <div className="space-y-12">
          {blog.content.map((section, index) => (
            <div key={index} className="space-y-6">
              {/* Section Heading */}
              {section.heading && (
                <h2 className="text-3xl font-bold text-gray-900 mt-8">
                  {section.heading}
                </h2>
              )}

              {/* Section Content - Alternating Layout */}
              <div
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center`}
              >
                {/* Text Content */}
                {section.text && (
                  <div className="flex-1">
                    <div
                      className="text-lg text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.text }}
                    />
                  </div>
                )}

                {/* Section Image */}
                {section.image && (
                  <div className="flex-1">
                    <img
                      src={section.image}
                      alt={section.heading || "Blog section"}
                      className="w-full h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Blog?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Blog Deleted Successfully"
        message={`"${blog.title}" has been removed.`}
        buttonText="Done"
      />
    </div>
  );
}
