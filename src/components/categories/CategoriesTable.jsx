"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import { fetchCategories, deleteCategory } from "@/store/slices/categoriesSlice";
import { fetchSubCategories } from "@/store/slices/subCategoriesSlice";
import AddCategoryModal from "./AddCategoryModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function CategoriesTable() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const { subCategories } = useSelector((state) => state.subCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedCategoryName, setDeletedCategoryName] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategoryForDelete(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCategoryForDelete) {
      setDeletedCategoryName(selectedCategoryForDelete.name);
      dispatch(deleteCategory(selectedCategoryForDelete.id)).then((result) => {
        if (result.type === deleteCategory.fulfilled.type) {
          setShowDeleteModal(false);
          setShowSuccessModal(true);
        }
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedCategoryForDelete(null);
    dispatch(fetchCategories());
  };

  return (
    <>
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
            <button
              onClick={handleAddClick}
              style={{ backgroundColor: "var(--primary)" }}
              className="px-5 py-2.5 text-white font-medium rounded-full hover:opacity-90 active:opacity-80 transition-all shadow-sm cursor-pointer"
            >
              + Add Category
            </button>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Category Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Sub Categories
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-600">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category) => {
                  const categorySubCategories = subCategories.filter(
                    (sub) => sub.category_id === category.id
                  );
                  return (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {categorySubCategories.length > 0 ? (
                            categorySubCategories.map((sub) => (
                              <span
                                key={sub.id}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"
                              >
                                {sub.name}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400">No sub categories</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit category"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete category"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedCategoryForDelete?.name}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Category Deleted Successfully"
        message={`${deletedCategoryName} has been removed from categories.`}
        buttonText="Done"
      />
    </>
  );
}
