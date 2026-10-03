"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createCoupon, updateCoupon, clearError } from "@/store/slices/couponsSlice";
import ErrorModal from "@/components/modals/ErrorModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function AddCouponModal({ isOpen, onClose, coupon }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.coupons);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    startDate: null,
    expiryDate: null,
    minPurchase: 0,
    maxUses: "",
    status: "active",
    description: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Midnight, not "now": DatePicker compares full timestamps, so using new Date()
  // directly would grey out today itself for the rest of the day.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // A coupon that already started in the past keeps its own saved date
  // selectable — otherwise opening this modal to change Max Uses would silently
  // force the dates forward. New coupons cannot be dated before today.
  const savedStart = coupon?.start_date ? new Date(coupon.start_date) : null;
  const savedExpiry = coupon?.expiry_date ? new Date(coupon.expiry_date) : null;

  const minStartDate = savedStart && savedStart < today ? savedStart : today;

  // Expiry is bounded by BOTH rules: never in the past, and never before the
  // start date — so a coupon cannot be saved expiring before it begins.
  const expiryFloor =
    formData.startDate && formData.startDate > today ? formData.startDate : today;
  const minExpiryDate =
    savedExpiry && savedExpiry < expiryFloor ? savedExpiry : expiryFloor;

  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setShowErrorModal(false);
      return;
    }

    if (coupon) {
      const couponWithDates = {
        id: coupon.id,
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || coupon.discount_type || "percentage",
        discountValue: coupon.discountValue || coupon.discount_value || "",
        startDate: coupon.start_date ? new Date(coupon.start_date) : null,
        expiryDate: coupon.expiry_date ? new Date(coupon.expiry_date) : null,
        minPurchase: coupon.minPurchase || coupon.min_purchase || 0,
        maxUses: coupon.maxUses || coupon.max_uses || "",
        status: coupon.status || "active",
      };
      setFormData(couponWithDates);
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        startDate: null,
        expiryDate: null,
        minPurchase: 0,
        maxUses: "",
        status: "active",
        description: "",
      });
    }
  }, [coupon, isOpen]);

  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error && isSubmitted) {
      setShowSuccessModal(true);
      setIsSubmitted(false);
    }
  }, [loading, error, isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "code") {
      const cleanValue = value.replace(/[^a-zA-Z0-9]/g, "");
      const upperValue = cleanValue.toUpperCase();
      setFormData({ ...formData, [name]: upperValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Coupon code is required";
    }
    if (!formData.discountValue || formData.discountValue <= 0) {
      errors.discountValue = "Discount value must be greater than 0";
    }
    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }
    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    }
    if (!formData.maxUses || formData.maxUses <= 0) {
      errors.maxUses = "Max uses must be greater than 0";
    }
    if (
      formData.startDate &&
      formData.expiryDate &&
      formData.expiryDate <= formData.startDate
    ) {
      errors.expiryDate = "Expiry date must be after start date";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    const formatDateToYYYYMMDD = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const submitData = {
      code: formData.code,
      description: formData.description,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formatDateToYYYYMMDD(formData.startDate),
      expiryDate: formatDateToYYYYMMDD(formData.expiryDate),
      minPurchase: parseFloat(formData.minPurchase) || 0,
      maxUses: parseInt(formData.maxUses),
      status: formData.status,
    };

    setIsSubmitted(true);
    if (coupon?.id) {
      dispatch(updateCoupon({ id: coupon.id, couponData: submitData }));
    } else {
      dispatch(createCoupon(submitData));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {coupon ? "Edit Coupon" : "Add Coupon"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Coupon Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g., SAVE20"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black uppercase ${
                fieldErrors.code ? "border-red-500" : "border-gray-300"
              }`}
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
            {fieldErrors.code && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., 20% off on all products"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                style={{ "--tw-ring-color": "var(--primary)" }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Discount Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                  fieldErrors.discountValue
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
              {fieldErrors.discountValue && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.discountValue}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => {
                  setFormData({ ...formData, startDate: date });
                  if (fieldErrors.startDate) {
                    setFieldErrors({ ...fieldErrors, startDate: "" });
                  }
                }}
                onChangeRaw={(e) => {
                  if (
                    e.target &&
                    typeof e.target.value === "string" &&
                    e.target.value.length > 0
                  ) {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 8);
                    let formatted = value;
                    if (value.length >= 2)
                      formatted = value.slice(0, 2) + "/" + value.slice(2);
                    if (value.length >= 4)
                      formatted =
                        value.slice(0, 2) +
                        "/" +
                        value.slice(2, 4) +
                        "/" +
                        value.slice(4, 8);
                    e.target.value = formatted;
                  }
                }}
                strictParsing={false}
                minDate={minStartDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                  fieldErrors.startDate ? "border-red-500" : "border-gray-300"
                }`}
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
              {fieldErrors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={formData.expiryDate}
                onChange={(date) => {
                  setFormData({ ...formData, expiryDate: date });
                  if (fieldErrors.expiryDate) {
                    setFieldErrors({ ...fieldErrors, expiryDate: "" });
                  }
                }}
                onChangeRaw={(e) => {
                  if (
                    e.target &&
                    typeof e.target.value === "string" &&
                    e.target.value.length > 0
                  ) {
                    const value = e.target.value
                      .replace(/[^0-9]/g, "")
                      .slice(0, 8);
                    let formatted = value;
                    if (value.length >= 2)
                      formatted = value.slice(0, 2) + "/" + value.slice(2);
                    if (value.length >= 4)
                      formatted =
                        value.slice(0, 2) +
                        "/" +
                        value.slice(2, 4) +
                        "/" +
                        value.slice(4, 8);
                    e.target.value = formatted;
                  }
                }}
                minDate={minExpiryDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                  fieldErrors.expiryDate ? "border-red-500" : "border-gray-300"
                }`}
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
              {fieldErrors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.expiryDate}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Min. Purchase (₹)
              </label>
              <input
                type="number"
                name="minPurchase"
                value={formData.minPurchase}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Max Uses <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleInputChange}
                placeholder="e.g.34"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                  fieldErrors.maxUses ? "border-red-500" : "border-gray-300"
                }`}
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
              {fieldErrors.maxUses && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.maxUses}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            >
              <option value="active">Active</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </form>

        <div className="border-t border-gray-200 p-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{ backgroundColor: "var(--primary)" }}
            className="flex-1 px-4 py-2 text-white font-medium rounded-full hover:opacity-90 transition-all cursor-pointer"
          >
            {coupon ? "Update" : "Add"} Coupon
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        title="Success"
        message={coupon ? "Coupon updated successfully" : "Coupon created successfully"}
        buttonText="Done"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          dispatch(clearError());
        }}
        title="Error"
        message={error || "An error occurred"}
        buttonText="Try Again"
      />
    </div>
  );
}
