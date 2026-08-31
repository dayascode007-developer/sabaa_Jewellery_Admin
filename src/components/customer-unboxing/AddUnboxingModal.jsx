"use client";

import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import SuccessModal from "@/components/modals/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal";

export default function AddUnboxingModal({
  isOpen,
  onClose,
  unboxing,
  onSave,
}) {
  const [formData, setFormData] = useState({
    title: "",
    youtubeLink: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (unboxing) {
      setFormData({
        title: unboxing.title || "",
        youtubeLink: unboxing.youtubeLink || unboxing.youtube_link || "",
      });
    } else {
      setFormData({
        title: "",
        youtubeLink: "",
      });
    }
  }, [unboxing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
      setFormData((prev) => ({
        ...prev,
        [name]: capitalizedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.youtubeLink) {
      setShowSuccessModal(true);
    } else {
      setErrorMessage("Please fill in all required fields");
      setShowErrorModal(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-medium text-gray-900">
            {unboxing ? "Edit Unboxing Video" : "Add Unboxing Video"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Video Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Gold Necklace Unboxing"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#430121]"
              required
            />
          </div>

          {/* YouTube Link */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              YouTube Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#430121]"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "#430121" }}
              className="flex-1 px-4 py-2 text-white font-medium rounded-full hover:opacity-90 transition-all cursor-pointer"
            >
              {unboxing ? "Update" : "Add"} Video
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onSave(formData);
          onClose();
        }}
        title="Success"
        message={unboxing ? "Unboxing video updated successfully" : "Unboxing video added successfully"}
        buttonText="Done"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage("");
        }}
        title="Error"
        message={errorMessage}
        buttonText="Try Again"
      />
    </div>
  );
}
