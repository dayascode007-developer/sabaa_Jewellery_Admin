"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  createSubMainCategory,
  updateSubMainCategory,
  fetchSubMainCategories,
} from "@/store/slices/subCategoriesSlice";
import SuccessModal from "@/components/modals/SuccessModal";
import CustomDropdown from "@/components/common/CustomDropdown";

export default function AddSubMainCategoryModal({ isOpen, onClose, subMainCategory }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [subMainCategoryName, setSubMainCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && subMainCategory) {
      setSubMainCategoryName(subMainCategory.name);
      setSelectedCategoryId(subMainCategory.category_id);
    } else if (isOpen) {
      setSubMainCategoryName("");
      setSelectedCategoryId("");
    }
  }, [isOpen, subMainCategory]);

  const handleNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z\s]/g, "");
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setSubMainCategoryName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subMainCategoryName.trim()) {
      alert("Sub Main Category name is required");
      return;
    }

    if (!selectedCategoryId) {
      alert("Please select a main category");
      return;
    }

    if (subMainCategory) {
      dispatch(
        updateSubMainCategory({
          id: subMainCategory.id,
          subMainCategoryData: {
            name: subMainCategoryName.trim(),
            categoryId: selectedCategoryId,
          },
        })
      ).then(() => {
        setSuccessMessage(`${subMainCategoryName} has been updated.`);
        setShowSuccessModal(true);
      });
    } else {
      dispatch(
        createSubMainCategory({
          name: subMainCategoryName.trim(),
          categoryId: selectedCategoryId,
        })
      ).then(() => {
        setSuccessMessage(`${subMainCategoryName} has been added to sub main categories.`);
        setShowSuccessModal(true);
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    dispatch(fetchSubMainCategories());
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
            {subMainCategory ? "Edit Sub Main Category" : "Add Sub Main Category"}
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
          <CustomDropdown
            options={categories}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
            label="Main Category"
            placeholder="Select a main category"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sub Main Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subMainCategoryName}
              onChange={handleNameChange}
              placeholder="Enter sub main category name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black bg-white placeholder:text-gray-500"
              style={{ "--tw-ring-color": "var(--primary)" }}
              required
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 hover:border-gray-400 active:opacity-80 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="flex-1 px-5 py-2.5 text-white font-medium rounded-full hover:opacity-90 active:opacity-80 transition-all shadow-sm cursor-pointer"
            >
              {subMainCategory ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={subMainCategory ? "Sub Main Category Updated Successfully" : "Sub Main Category Added Successfully"}
        message={successMessage}
        buttonText="Done"
      />
    </div>
  );
}
