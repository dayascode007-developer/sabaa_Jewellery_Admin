"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose } from "react-icons/md";
import SuccessModal from "@/components/modals/SuccessModal";
import { updateInventoryStock, fetchInventoryStats } from "@/store/slices/inventorySlice";
import { fetchAlertProducts } from "@/store/slices/productsSlice";

export default function UpdateStockModal({ isOpen, onClose, product }) {
  const dispatch = useDispatch();
  const { loading, updateError } = useSelector((state) => state.inventory);
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      setStock(product.stock.toString());
      setLowStockThreshold(product.lowStockThreshold?.toString() || "5");
      setError(null);
    }
  }, [isOpen, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (stock === undefined || stock === "" || isNaN(stock)) {
      setError("Stock quantity is required");
      return;
    }

    if (lowStockThreshold === undefined || lowStockThreshold === "" || isNaN(lowStockThreshold)) {
      setError("Low stock threshold is required");
      return;
    }

    dispatch(
      updateInventoryStock({
        productId: product.id,
        stock: parseInt(stock, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
      })
    ).then((result) => {
      if (result.payload) {
        setShowSuccessModal(true);
      } else if (result.payload === undefined) {
        setError(updateError || "Failed to update stock");
      }
    });
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    dispatch(fetchAlertProducts());
    dispatch(fetchInventoryStats());
    onClose();
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
          <h2 className="text-xl font-semibold text-gray-900">Edit Stock</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Product Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Product</p>
          <p className="text-lg font-semibold text-gray-900">
            {product?.product}
          </p>
          <p className="text-sm text-gray-600 mt-2">SKU: {product?.sku}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || updateError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error || updateError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "var(--primary)" }}
              className="flex-1 px-4 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Stock Updated Successfully"
        message={`Stock quantity updated to ${stock} units and threshold set to ${lowStockThreshold}.`}
        buttonText="Done"
      />
    </div>
  );
}
