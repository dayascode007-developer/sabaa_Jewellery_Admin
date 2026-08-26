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
  const mockOrderDetails = {
    ...order,
    billingDetails: {
      name: "Venkat Esan",
      address: "Venkateshanaa Rathinasabapathy, 90/22 mariamman koil street, thirupadilyur",
      city: "Cuddalore",
      zip: "607002",
      state: "Tamil Nadu",
      email: "nakshathinternationalgg@gmail.com",
      phone: "+919994312242",
    },
    shippingDetails: {
      name: "Venkat Esan",
      address: "Venkateshanaaa rathinasabapathy, 90/22 mariamman koil street, thirupadilyur",
      city: "Cuddalore",
      zip: "607002",
      state: "Tamil Nadu",
    },
    shippingMethod: "Flat rate",
    paymentMethod: "UPI (103366225719)",
    items: [
      {
        id: 1,
        name: "Couple Name Panchalogam Ring LR103 LR103",
        quantity: 1,
        tax: "₹0.00",
        total: "₹1,270.00",
        details: {
          "_field_2: ": "Ram",
          "_field_18: ": "S1",
          "_field_3: ": "F1",
          "Ring Name : ": "Ram",
          ": ": "S1",
          "Font Style: ": "F1",
          "Select ring size: ": "20",
        },
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Order {order.orderNumber}
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
                Billing details
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium">{mockOrderDetails.billingDetails.name}</p>
                <p>{mockOrderDetails.billingDetails.address}</p>
                <p>
                  {mockOrderDetails.billingDetails.city}{" "}
                  {mockOrderDetails.billingDetails.zip}
                </p>
                <p>{mockOrderDetails.billingDetails.state}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-900">Email</span>
                  <br />
                  <a
                    href={`mailto:${mockOrderDetails.billingDetails.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {mockOrderDetails.billingDetails.email}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Phone</span>
                  <br />
                  <a
                    href={`tel:${mockOrderDetails.billingDetails.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {mockOrderDetails.billingDetails.phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping details
              </h3>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium">{mockOrderDetails.shippingDetails.name}</p>
                <p>{mockOrderDetails.shippingDetails.address}</p>
                <p>
                  {mockOrderDetails.shippingDetails.city}{" "}
                  {mockOrderDetails.shippingDetails.zip}
                </p>
                <p>{mockOrderDetails.shippingDetails.state}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-semibold text-gray-900">Shipping method</span>
                  <br />
                  <span className="font-medium text-gray-600">{mockOrderDetails.shippingMethod}</span>
                </p>
                <p>
                  <span className="font-semibold text-gray-900">Payment via</span>
                  <br />
                  <span className="font-medium text-gray-600">{mockOrderDetails.paymentMethod}</span>
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
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Tax
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockOrderDetails.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {item.name}
                      </p>
                      <div className="text-xs text-gray-600 space-y-1">
                        {Object.entries(item.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}</span> {value}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{item.quantity}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">{item.tax}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.total}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="mt-6 flex justify-end">
            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-xs">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 mb-2">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-gray-900">₹0.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹{order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
