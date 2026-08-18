"use client";

import { useState } from "react";
import { MdEdit } from "react-icons/md";
import UpdateStockModal from "./UpdateStockModal";

export default function InventoryTable({ inventoryItems }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleEditClick = (item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return { bg: "bg-red-50", text: "text-red-600", badge: "Critical" };
      case "low":
        return { bg: "bg-yellow-50", text: "text-yellow-600", badge: "Low" };
      case "good":
        return { bg: "bg-green-50", text: "text-green-600", badge: "In Stock" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-600", badge: "Unknown" };
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
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
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryItems.map((item) => {
              const statusColor = getStatusColor(item.status);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}
                    >
                      {statusColor.badge}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="flex cursor-pointer items-center gap-2 hover:opacity-80 transition-opacity"
                        style={{ color: "var(--primary)" }}
                        title="Edit stock"
                      >
                        <MdEdit size={18} />
                        <span className="text-sm font-medium">Update Stock</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <UpdateStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </>
  );
}
