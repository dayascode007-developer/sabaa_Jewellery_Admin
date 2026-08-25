"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import {
  createSubCategory,
  updateSubCategory,
  fetchSubCategories,
} from "@/store/slices/subCategoriesSlice";
import SuccessModal from "@/components/modals/SuccessModal";
import CustomDropdown from "@/components/common/CustomDropdown";

export default function AddSubCategoryModal({ isOpen, onClose, subCategory }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && subCategory) {
      setSubCategoryName(subCategory.name);
      setSelectedCategoryId(subCategory.category_id);
    } else if (isOpen) {
      setSubCategoryName("");
      setSelectedCategoryId("");
    }
  }, [isOpen, subCategory]);

  const handleSubCategoryNameChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z\s]/g, "");
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setSubCategoryName(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!subCategoryName.trim()) {
      alert("Sub category name is required");
      return;
    }

    if (!selectedCategoryId) {
      alert("Please select a category");
      return;
    }

    if (subCategory) {
      dispatch(
        updateSubCategory({
          id: subCategory.id,
          subCategoryData: {
            name: subCategoryName.trim(),
            categoryId: selectedCategoryId,
          },
        })
      ).then(() => {
        setSuccessMessage(`${subCategoryName} has been updated.`);
        setShowSuccessModal(true);
      });
    } else {
      dispatch(
        createSubCategory({
          name: subCategoryName.trim(),
          categoryId: selectedCategoryId,
        })
      ).then(() => {
        setSuccessMessage(`${subCategoryName} has been added to sub categories.`);
        setShowSuccessModal(true);
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
    dispatch(fetchSubCategories());
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
            {subCategory ? "Edit Sub Category" : "Add Sub Category"}
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
            placeholder="Select a category"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Sub Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subCategoryName}
              onChange={handleSubCategoryNameChange}
              placeholder="Enter sub category name"
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
              {subCategory ? "Update" : "Add Sub Category"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={subCategory ? "Sub Category Updated Successfully" : "Sub Category Added Successfully"}
        message={successMessage}
        buttonText="Done"
      />
    </div>
  );
}
