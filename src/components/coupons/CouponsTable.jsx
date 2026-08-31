"use client";

import { MdEdit, MdDelete } from "react-icons/md";

export default function CouponsTable({ coupons, onEdit, onDelete, startIndex = 0 }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              No
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Code
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Min. Purchase
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Expiry
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <tr
                key={coupon.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="text-gray-900 font-medium">{startIndex + index + 1}</p>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{coupon.code}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {coupon.description}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-900 font-medium">
                    {(coupon.discountType || coupon.discount_type) ===
                    "percentage"
                      ? `${coupon.discountValue || coupon.discount_value}%`
                      : `₹${coupon.discountValue || coupon.discount_value}`}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">
                    ₹{coupon.minPurchase || coupon.min_purchase}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">
                    {new Date(
                      coupon.expiryDate || coupon.expiry_date
                    ).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">
                    {coupon.usedCount || coupon.used_count} /{" "}
                    {coupon.maxUses || coupon.max_uses}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      coupon.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.status === "active" ? "Active" : "Expired"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(coupon.id)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors cursor-pointer"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(coupon.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors cursor-pointer"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-12 text-center text-gray-600">
                No coupons found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
