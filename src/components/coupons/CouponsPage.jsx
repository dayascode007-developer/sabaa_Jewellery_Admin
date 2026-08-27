"use client";

import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import CouponsTable from "./CouponsTable";
import AddCouponModal from "./AddCouponModal";
import DeleteConfirmModal from "../products/DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "SAVE20",
      discountType: "percentage",
      discountValue: 20,
      startDate: "2026-08-01",
      expiryDate: "2026-09-30",
      minPurchase: 1000,
      maxUses: 100,
      usedCount: 45,
      status: "active",
      description: "20% off on all products",
    },
    {
      id: 2,
      code: "FLAT500",
      discountType: "fixed",
      discountValue: 500,
      startDate: "2026-08-10",
      expiryDate: "2026-12-31",
      minPurchase: 2000,
      maxUses: 50,
      usedCount: 12,
      status: "active",
      description: "Flat ₹500 off",
    },
    {
      id: 3,
      code: "SUMMER30",
      discountType: "percentage",
      discountValue: 30,
      startDate: "2026-06-01",
      expiryDate: "2026-08-31",
      minPurchase: 1500,
      maxUses: 200,
      usedCount: 198,
      status: "expired",
      description: "Summer sale - 30% off",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    setShowModal(true);
  };

  const handleDeleteClick = (id, couponCode) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setCoupons(coupons.filter((c) => c.id !== deletingId));
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setDeletingId(null);
    }
  };

  const handleSave = (formData) => {
    if (editingId) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingId ? { ...formData, id: editingId, usedCount: c.usedCount } : c
        )
      );
    } else {
      setCoupons([...coupons, { ...formData, id: Date.now(), usedCount: 0 }]);
    }
    setShowModal(false);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editingCoupon = editingId ? coupons.find((c) => c.id === editingId) : null;
  const deletingCoupon = deletingId ? coupons.find((c) => c.id === deletingId) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600 mt-2">Manage promotional coupons and discounts</p>
        </div>
        <button
          onClick={handleAdd}
          style={{ backgroundColor: "var(--primary)" }}
          className="px-4 py-2 text-white rounded-full hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
        >
          <MdAdd size={20} /> Add Coupon
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
        <MdSearch className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by coupon code or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-black"
        />
      </div>

      {/* Table */}
      <CouponsTable coupons={filteredCoupons} onEdit={handleEdit} onDelete={handleDeleteClick} />

      {/* Add/Edit Modal */}
      {showModal && (
        <AddCouponModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
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
        title="Coupon Deleted Successfully"
        message="The coupon has been deleted from your system."
        buttonText="Done"
      />
    </div>
  );
}
