"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import {
  fetchSubMainCategories,
  deleteSubMainCategory,
} from "@/store/slices/subCategoriesSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import AddSubMainCategoryModal from "./AddSubMainCategoryModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function SubMainCategoriesTable() {
  const dispatch = useDispatch();
  const { subMainCategories, loading } = useSelector((state) => state.subCategories);
  const { categories } = useSelector((state) => state.categories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubMainCategory, setSelectedSubMainCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedName, setDeletedName] = useState("");

  useEffect(() => {
    dispatch(fetchSubMainCategories());
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const handleEditClick = (subMainCategory) => {
    setSelectedSubMainCategory(subMainCategory);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedSubMainCategory(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (subMainCategory) => {
    setSelectedForDelete(subMainCategory);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedForDelete) {
      setDeletedName(selectedForDelete.name);
      dispatch(deleteSubMainCategory(selectedForDelete.id)).then((result) => {
        if (result.type === deleteSubMainCategory.fulfilled.type) {
          setShowDeleteModal(false);
          setShowSuccessModal(true);
        }
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedForDelete(null);
    dispatch(fetchSubMainCategories());
  };

  const getCategoryName = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId)?.name || "—";
  };

  const isInitialLoading = loading && subMainCategories.length === 0;

  return (
    <>
      {isInitialLoading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Sub Main Categories</h2>
            <button
              onClick={handleAddClick}
              style={{ backgroundColor: "var(--primary)" }}
              className="px-5 py-2.5 text-white font-medium rounded-full hover:opacity-90 active:opacity-80 transition-all shadow-sm cursor-pointer"
            >
              + Add Sub Main Category
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
                  Sub Main Category Name
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
              {subMainCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-600">
                    No sub main categories found
                  </td>
                </tr>
              ) : (
                subMainCategories.map((subMainCat, index) => (
                  <tr key={subMainCat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 w-12">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{subMainCat.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {getCategoryName(subMainCat.category_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(subMainCat)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit sub main category"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subMainCat)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete sub main category"
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

      {/* Add Sub Main Category Modal */}
      <AddSubMainCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subMainCategory={selectedSubMainCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedForDelete?.name}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Sub Main Category Deleted Successfully"
        message={`${deletedName} has been removed from sub main categories.`}
        buttonText="Done"
      />
    </>
  );
}
