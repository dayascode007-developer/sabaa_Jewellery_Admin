"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "@/store/slices/subCategoriesSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import AddSubCategoryModal from "./AddSubCategoryModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function SubCategoriesTable() {
  const dispatch = useDispatch();
  const { subCategories, loading } = useSelector((state) => state.subCategories);
  const { categories } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubCategoryForDelete, setSelectedSubCategoryForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedSubCategoryName, setDeletedSubCategoryName] = useState("");

  useEffect(() => {
    dispatch(fetchSubCategories());
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleEditClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedSubCategory(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (subCategory) => {
    setSelectedSubCategoryForDelete(subCategory);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubCategoryForDelete) {
      setDeletedSubCategoryName(selectedSubCategoryForDelete.name);
      dispatch(deleteSubCategory(selectedSubCategoryForDelete.id)).then((result) => {
        if (result.type === deleteSubCategory.fulfilled.type) {
          setShowDeleteModal(false);
          setShowSuccessModal(true);
        }
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedSubCategoryForDelete(null);
    dispatch(fetchSubCategories());
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "—";
  };

  // Only show skeleton on initial load, not when switching data
  const isInitialLoading = loading && subCategories.length === 0;

  return (
    <>
      {isInitialLoading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Sub Categories</h2>
            <button
              onClick={handleAddClick}
              style={{ backgroundColor: "var(--primary)" }}
              className="px-5 py-2.5 text-white font-medium rounded-full hover:opacity-90 active:opacity-80 transition-all shadow-sm cursor-pointer"
            >
              + Add Sub Category
            </button>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12">
                  No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Sub Category Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Main Category
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                    No sub categories found
                  </td>
                </tr>
              ) : (
                subCategories.map((subCategory, index) => (
                  <tr key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 w-12">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{subCategory.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {getCategoryName(subCategory.category_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(subCategory)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit sub category"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subCategory)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete sub category"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Sub Category Modal */}
      <AddSubCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subCategory={selectedSubCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedSubCategoryForDelete?.name}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Sub Category Deleted Successfully"
        message={`${deletedSubCategoryName} has been removed from sub categories.`}
        buttonText="Done"
      />
    </>
  );
}
