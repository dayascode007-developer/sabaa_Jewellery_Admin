"use client";

import { MdClose, MdWarning } from "react-icons/md";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName = "Product",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MdClose size={24} className="text-gray-600" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <MdWarning size={32} className="text-red-600" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          Delete Product?
        </h2>
        <p className="text-gray-600 text-center text-sm mb-2">
          Are you sure you want to delete
        </p>
        <p className="text-gray-900 text-center font-semibold mb-6">
          {productName}
        </p>
        <p className="text-gray-600 text-center text-xs mb-6">
          This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
