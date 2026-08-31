"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdChevronLeft, MdChevronRight } from "react-icons/md";
import UnboxingCard from "./UnboxingCard";
import AddUnboxingModal from "./AddUnboxingModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import SuccessModal from "@/components/modals/SuccessModal";
import {
  fetchUnboxing,
  createUnboxing,
  updateUnboxing,
  deleteUnboxing,
  clearError,
} from "@/store/slices/unboxingSlice";

export default function UnboxingManager() {
  const dispatch = useDispatch();
  const { data, loading, error, total } = useSelector(
    (state) => state.unboxing
  );

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(
      fetchUnboxing({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      })
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      setIsInitialLoad(false);
    }
  }, [loading, data.length]);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const handleAdd = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      dispatch(deleteUnboxing(deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      setShowSuccessModal(true);
      setCurrentPage(1);
    }
  };

  const handleSave = (formData) => {
    if (editingId) {
      dispatch(updateUnboxing({ id: editingId, unboxingData: formData }));
    } else {
      dispatch(createUnboxing(formData));
    }
    setShowModal(false);
    setEditingId(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const editingUnboxing = editingId
    ? data.find((u) => u.id === editingId)
    : null;

  if (loading && isInitialLoad) {
    return (
      <div className="space-y-6">
        <div className="space-y-3 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <SkeletonLoader type="card" count={itemsPerPage} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">
            Customer Unboxing
          </h1>
          <p className="text-gray-600 mt-2">Manage customer unboxing videos</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ backgroundColor: "#430121" }}
          className="px-4 py-2 text-white rounded-full hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
        >
          <MdAdd size={20} /> Add Video
        </button>
      </div>

      {/* Pagination */}
      {data.length > 0 && (
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {data.length > 0
              ? `${startIndex + 1}–${Math.min(endIndex, total)} of ${total}`
              : "0 of 0"}
          </span>
          <button
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <MdChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <MdChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      )}

      {/* Unboxing Grid */}
      {data.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {data.map((unboxing) => (
            <UnboxingCard
              key={unboxing.id}
              unboxing={unboxing}
              onEdit={() => handleEdit(unboxing.id)}
              onDelete={() => handleDeleteClick(unboxing.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg">No unboxing videos</p>
          <p className="text-gray-500 text-sm mt-1">
            Add your first unboxing video
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddUnboxingModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingId(null);
          }}
          unboxing={editingUnboxing}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        title="Delete Unboxing Video"
        message="Are you sure you want to delete this unboxing video? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingId(null);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
        }}
        title="Success"
        message="Unboxing video deleted successfully"
        buttonText="Done"
        autoClose={2000}
      />
    </div>
  );
}
