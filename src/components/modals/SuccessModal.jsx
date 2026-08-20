"use client";

import { MdClose, MdCheckCircle } from "react-icons/md";

export default function SuccessModal({
  isOpen,
  onClose,
  title = "Operation successful",
  message = "Your action has been completed successfully.",
  buttonText = "Got it",
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

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-green-50 rounded-full flex items-center justify-center">
              <MdCheckCircle size={48} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-center text-sm mb-6">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          style={{ backgroundColor: "var(--primary)" }}
          className="w-full px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
