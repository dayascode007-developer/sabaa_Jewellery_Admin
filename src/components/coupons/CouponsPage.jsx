"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdAdd, MdSearch, MdChevronLeft, MdChevronRight } from "react-icons/md";
import CouponsTable from "./CouponsTable";
import AddCouponModal from "./AddCouponModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { fetchCoupons, deleteCoupon } from "@/store/slices/couponsSlice";

export default function CouponsPage() {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector((state) => state.coupons);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

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

  const handleConfirmDelete = async () => {
    if (deletingId) {
      try {
        const result = await dispatch(deleteCoupon(deletingId)).unwrap();
        setShowDeleteModal(false);
        setSuccessMessage("Coupon deleted successfully");
        setShowSuccessModal(true);
        setDeletingId(null);
      } catch (err) {
        console.error("Error deleting coupon:", err);
        setShowDeleteModal(false);
        setDeletingId(null);
      }
    }
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const editingCoupon = editingId
    ? coupons.find((c) => c.id === editingId)
    : null;
  const deletingCoupon = deletingId
    ? coupons.find((c) => c.id === deletingId)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-2">
            Manage promotional coupons and discounts
          </p>
        </div>
        <button
          onClick={handleAdd}
          style={{ backgroundColor: "var(--primary)" }}
          className="px-4 py-2 text-white rounded-full hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
        >
          <MdAdd size={20} /> Add Coupon
        </button>
      </div>

      {/* Search & Pagination */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200 flex-1 md:flex-initial md:w-80">
          <MdSearch className="text-gray-400 flex-shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search by coupon code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent"
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm text-black whitespace-nowrap">
            {filteredCoupons.length > 0
              ? `${startIndex + 1}–${Math.min(
                  endIndex,
                  filteredCoupons.length
                )} of ${filteredCoupons.length}`
              : "0 of 0"}
          </span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <MdChevronLeft size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0"
          >
            <MdChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <CouponsTable
          coupons={paginatedCoupons || []}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          startIndex={startIndex}
        />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AddCouponModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          coupon={editingCoupon}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={`Coupon "${deletingCoupon?.code || ""}"`}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message={successMessage || "Operation completed successfully"}
        buttonText="Done"
      />
    </div>
  );
}
