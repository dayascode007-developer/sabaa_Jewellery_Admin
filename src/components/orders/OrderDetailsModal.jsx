"use client";

import { MdClose } from "react-icons/md";

const getStatusColor = (status) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
    Delivered: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function OrderDetailsModal({ order, onClose }) {

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{ fontFamily: "'Lora', serif" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</p>
              <h2 className="text-2xl font-bold text-slate-900">
                {order.purchase_id}
              </h2>
            </div>
            <span className={`px-4 py-2 text-xs font-bold rounded-full border ${getStatusColor(
              order.status.charAt(0).toUpperCase() + order.status.slice(1)
            )}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Info Cards Grid */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Customer Card */}
            <div className="rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Customer
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Name</p>
                  <p className="text-sm font-medium text-slate-900">{order.customer?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Email</p>
                  <a
                    href={`mailto:${order.customer?.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    {order.customer?.email || "—"}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Phone</p>
                  <a
                    href={`tel:${order.customer?.mobile}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {order.customer?.mobile || "—"}
                  </a>
                </div>
              </div>
            </div>

            {/* Shipping Card */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Shipping Address
                </h3>
              </div>
              {order.address ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Recipient</p>
                    <p className="text-sm font-medium text-slate-900">{order.address.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Address</p>
                    <p className="text-sm text-slate-700">
                      {order.address.house}, {order.address.area}
                      {order.address.landmark && ` • ${order.address.landmark}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Location</p>
                    <p className="text-sm text-slate-700">
                      {order.address.city}, {order.address.state} {order.address.pincode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Mobile</p>
                    <p className="text-sm font-medium text-slate-900">{order.address.mobile}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No shipping address available</p>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Payment</p>
                <p className="text-sm font-medium text-slate-900 capitalize">
                  {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Section */}
          <div className="rounded-lg p-6 border border-slate-200 mb-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Order Items</h4>
            {order.item ? (
              <div className="space-y-4">
                <div className="rounded-lg p-4 border border-slate-200">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Purchase ID</p>
                      <p className="text-sm font-medium text-slate-900">{order.item.purchase_id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Product</p>
                      <p className="text-sm font-medium text-slate-900">{order.item.title}</p>
                      {order.item.sku && <p className="text-xs text-slate-500 mt-1">SKU: {order.item.sku}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Quantity</p>
                      <p className="text-sm font-medium text-slate-900">{order.item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-1">Price</p>
                      <p className="text-sm font-bold text-slate-900">
                        ₹{parseFloat(order.item.sale_price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Customization Details */}
                  {(order.item.ring_size || order.item.ring_name || order.item.font_id || order.item.color_id || order.item.symbol_id || order.item.symbol_side) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-3">Customization Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        {order.item.ring_size && (
                          <div className="rounded p-2 border border-slate-200">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Ring Size</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.ring_size}</p>
                          </div>
                        )}
                        {order.item.ring_name && (
                          <div className="bg-slate-100 rounded p-2">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Ring Name</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.ring_name}</p>
                          </div>
                        )}
                        {order.item.font_id && (
                          <div className="bg-slate-100 rounded p-2">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Font Style</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.font_id}</p>
                          </div>
                        )}
                        {order.item.color_id && (
                          <div className="bg-slate-100 rounded p-2">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Enamel Color</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.color_id}</p>
                          </div>
                        )}
                        {order.item.symbol_id && (
                          <div className="bg-slate-100 rounded p-2">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Symbol</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.symbol_id}</p>
                          </div>
                        )}
                        {order.item.symbol_side && (
                          <div className="bg-slate-100 rounded p-2">
                            <p className="text-xs text-slate-600 font-semibold uppercase">Symbol Direction</p>
                            <p className="text-sm text-slate-900 font-medium">{order.item.symbol_side}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Customer Photo */}
                  {order.item.customer_faced_img && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-600 font-semibold uppercase mb-3">Customer Provided Photo</p>
                      <div className="flex gap-4 items-start rounded-lg p-3 border border-slate-200">
                        <img
                          src={order.item.customer_faced_img}
                          alt="Customer provided"
                          className="w-24 h-24 object-cover rounded-lg border border-slate-300 shadow-sm"
                        />
                        <div className="flex-1">
                          <a
                            href={order.item.customer_faced_img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                          >
                            View Full Image ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No items available</p>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="mt-8 border border-slate-200 rounded-lg p-6 ml-auto w-full max-w-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">Order Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-sm font-medium text-slate-900">
                  ₹{parseFloat(order.subtotal || 0).toFixed(2)}
                </span>
              </div>
              {parseFloat(order.discount_amount || 0) > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-sm font-medium">Discount</span>
                  <span className="text-sm font-bold">-₹{parseFloat(order.discount_amount || 0).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Shipping</span>
                <span className="text-sm font-medium text-slate-900">₹{parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">
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
