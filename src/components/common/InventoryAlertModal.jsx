"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { MdClose, MdWarning } from "react-icons/md";
import { fetchAlertProducts } from "@/store/slices/productsSlice";

export default function InventoryAlertModal() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { products = [] } = useSelector((state) => state.products || {});
  const [dismissed, setDismissed] = useState(false);

  // Fetch alert products on mount
  useEffect(() => {
    dispatch(fetchAlertProducts());
  }, [dispatch]);

  // Check if any products have low or out-of-stock status
  const alertProducts = Array.isArray(products)
    ? products.filter(
        (product) =>
          product.stock_status === "low" ||
          product.stock_status === "out-of-stock"
      )
    : [];

  // Reset dismissed flag when page changes
  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  // Reset dismissed flag when alert products change
  useEffect(() => {
    if (alertProducts.length > 0) {
      setDismissed(false);
    }
  }, [alertProducts.length]);

  if (dismissed || !alertProducts || alertProducts.length === 0) return null;

  const lowStockCount = alertProducts.filter(
    (p) => p.stock_status === "low"
  ).length;
  const outOfStockCount = alertProducts.filter(
    (p) => p.stock_status === "out-of-stock"
  ).length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <MdWarning size={24} className="text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Alert
            </h2>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Alert Summary */}
        <p className="text-sm text-gray-600 mb-4">
          {alertProducts.length} product(s) need attention
          {lowStockCount > 0 && ` (${lowStockCount} low stock)`}
          {outOfStockCount > 0 && ` (${outOfStockCount} out of stock)`}
        </p>

        {/* Products List */}
        <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
          {alertProducts.map((product) => (
            <div
              key={product.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {product.title}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  SKU: {product.sku} • Stock: {product.quantity} • Min: {product.min_stock}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                  product.stock_status === "out-of-stock"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {product.stock_status === "out-of-stock"
                  ? "Out of stock"
                  : "Low"}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all cursor-pointer"
          >
            Dismiss
          </button>
          <a
            href="/inventory"
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all text-center cursor-pointer"
          >
            Go to Inventory
          </a>
        </div>
      </div>
    </div>
  );
}
