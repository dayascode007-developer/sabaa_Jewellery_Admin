"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { MdClose } from "react-icons/md";
import { createCategory, updateCategory, fetchCategories } from "@/store/slices/categoriesSlice";
import SuccessModal from "@/components/modals/SuccessModal";

export default function AddCategoryModal({ isOpen, onClose, category }) {
  const dispatch = useDispatch();
  const [categoryName, setCategoryName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && category) {
      setCategoryName(category.name);
    } else if (isOpen) {
      setCategoryName("");
    }
  }, [isOpen, category]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required");
      return;
    }

    if (category) {
      dispatch(
        updateCategory({
          id: category.id,
          categoryData: { name: categoryName.trim() },
        })
      ).then(() => {
        setSuccessMessage(`${categoryName} has been updated.`);
        setShowSuccessModal(true);
      });
    } else {
      dispatch(
        createCategory({ name: categoryName.trim() })
      ).then(() => {
        setSuccessMessage(`${categoryName} has been added to categories.`);
        setShowSuccessModal(true);
      });
    }
  };

  const handleCategoryNameChange = (e) => {
    let value = e.target.value;
    // Allow only letters and spaces
    value = value.replace(/[^a-zA-Z\s]/g, "");
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setCategoryName(value);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    dispatch(fetchCategories());
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {category ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={handleCategoryNameChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black bg-white"
              style={{ "--tw-ring-color": "var(--primary)" }}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-100 hover:border-gray-400 active:opacity-80 transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="flex-1 px-5 py-2.5 text-white font-semibold rounded-full hover:opacity-90 active:opacity-80 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              {category ? "Update" : "Add Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={category ? "Category Updated Successfully" : "Category Added Successfully"}
        message={successMessage}
        buttonText="Done"
      />
    </div>
  );
}
