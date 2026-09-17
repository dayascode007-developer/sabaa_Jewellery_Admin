"use client";

import { MdClose } from "react-icons/md";

const getStatusColor = (status) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function OrderDetailsModal({ order, onClose }) {

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {order.purchase_id}
            </h2>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Billing Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Details
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium">{order.customer?.name}</p>
                <p>{order.customer?.email}</p>
                <p>{order.customer?.mobile}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-900">Email</span>
                  <br />
                  <a
                    href={`mailto:${order.customer?.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customer?.email || "—"}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Phone</span>
                  <br />
                  <a
                    href={`tel:${order.customer?.mobile}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.customer?.mobile || "—"}
                  </a>
                </p>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h3>
              {order.address ? (
                <div className="space-y-1 text-sm text-gray-700">
                  <p className="font-medium">{order.address.name}</p>
                  <p>{order.address.house}, {order.address.area}</p>
                  {order.address.landmark && <p>{order.address.landmark}</p>}
                  <p>
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Mobile:</span> {order.address.mobile}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No shipping address available</p>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-900">Payment Method</span>
                  <br />
                  <span className="font-medium text-gray-600 capitalize">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="border-t border-gray-200 pt-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Purchase ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.item ? (
                  <>
                    <tr className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.item.purchase_id}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.item.title}
                        </p>
                        {order.item.sku && (
                          <p className="text-xs text-gray-600">SKU: {order.item.sku}</p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-900">{order.item.quantity}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{parseFloat(order.item.sale_price || 0).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                    {/* Customization Details Row */}
                    {(order.item.ring_size || order.item.ring_name || order.item.font_id || order.item.color_id || order.item.symbol_id || order.item.symbol_side) && (
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <td colSpan="4" className="py-4 px-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {order.item.ring_size && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Ring Size</p>
                                <p className="text-sm text-gray-900">{order.item.ring_size}</p>
                              </div>
                            )}
                            {order.item.ring_name && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Ring Name</p>
                                <p className="text-sm text-gray-900">{order.item.ring_name}</p>
                              </div>
                            )}
                            {order.item.font_id && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Font Style</p>
                                <p className="text-sm text-gray-900">{order.item.font_id}</p>
                              </div>
                            )}
                            {order.item.color_id && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Enamel Color</p>
                                <p className="text-sm text-gray-900">{order.item.color_id}</p>
                              </div>
                            )}
                            {order.item.symbol_id && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Symbol</p>
                                <p className="text-sm text-gray-900">{order.item.symbol_id}</p>
                              </div>
                            )}
                            {order.item.symbol_side && (
                              <div>
                                <p className="text-xs font-semibold text-gray-600 uppercase">Symbol Direction</p>
                                <p className="text-sm text-gray-900">{order.item.symbol_side}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                      No items available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mt-6 flex justify-end">
            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-xs">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{parseFloat(order.subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 mb-2">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-gray-900">₹{parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
