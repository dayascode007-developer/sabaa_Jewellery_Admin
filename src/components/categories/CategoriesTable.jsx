"use client";

import { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import AddCategoryModal from "./AddCategoryModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function CategoriesTable({ categories }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedCategoryName, setDeletedCategoryName] = useState("");

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
    setDeletedCategoryName(selectedCategoryForDelete?.name);
    setShowDeleteModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedCategoryForDelete(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Categories</h2>
          <button
            onClick={handleAddClick}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
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
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
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
            ))}
          </tbody>
        </table>
      </div>

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
