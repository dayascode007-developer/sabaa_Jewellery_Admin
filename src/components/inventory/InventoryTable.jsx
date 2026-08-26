"use client";

import { useState } from "react";
import { MdEdit, MdChevronLeft, MdChevronRight } from "react-icons/md";
import UpdateStockModal from "./UpdateStockModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function InventoryTable({
  inventoryItems,
  loading = false,
  pagination = { page: 1, limit: 10, total: 0, pages: 0 },
  onPageChange = () => {},
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "low":
        return { bg: "bg-yellow-50", text: "text-yellow-600", badge: "Low" };
      case "in-stock":
        return { bg: "bg-green-50", text: "text-green-600", badge: "In stock" };
      case "out-of-stock":
        return { bg: "bg-red-50", text: "text-red-600", badge: "Out of stock" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-600", badge: "Unknown" };
    }
  };

  return (
    <>
      {/* Pagination Top */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-end gap-4 mb-4">
          <span className="text-sm text-gray-600">
            {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous page"
            >
              <MdChevronLeft size={20} />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next page"
            >
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {loading && inventoryItems.length === 0 ? (
        <SkeletonLoader type="table" count={10} />
      ) : !loading && inventoryItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-sm">No products found</p>
        </div>
      ) : (
        <div
          className={`bg-white rounded-lg shadow-sm overflow-hidden transition-opacity ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  No.
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Low stock Threshold
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventoryItems.map((item, index) => {
                const statusColor = getStatusColor(item.status);
                const serialNumber =
                  (pagination.page - 1) * pagination.limit + index + 1;
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{serialNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{item.sku}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.stock}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.lowStockThreshold}
                      </p>
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}
                      >
                        {statusColor.badge}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="flex cursor-pointer items-center gap-4 hover:opacity-80 transition-opacity"
                          style={{ color: "var(--primary)" }}
                          title="Edit stock"
                        >
                          <MdEdit size={18} />
                          <span className="text-sm font-medium">
                            Update Stock
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <UpdateStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </>
  );
}
