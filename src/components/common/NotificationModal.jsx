"use client";

import { useState, useEffect } from "react";
import { MdClose, MdShoppingCart, MdCheckCircle, MdLocalShipping } from "react-icons/md";

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .notification-panel-backdrop {
    animation: fadeIn 0.3s ease-out;
  }

  .notification-panel-content {
    animation: slideDown 0.4s ease-out;
  }

  .notification-item {
    animation: slideIn 0.3s ease-out;
  }

  .notification-item:nth-child(1) { animation-delay: 0.05s; }
  .notification-item:nth-child(2) { animation-delay: 0.1s; }
  .notification-item:nth-child(3) { animation-delay: 0.15s; }
  .notification-item:nth-child(n+4) { animation-delay: 0.2s; }
`;

const mockNotifications = [
  {
    id: 1,
    type: "new_order",
    title: "New Order #ORD-001",
    description: "Stylish I initial Panchaloga Ring - Quantity: 2",
    timestamp: "2 mins ago",
    icon: MdShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    type: "payment_received",
    title: "Payment Received",
    description: "Order #ORD-001 - ₹45,999 payment confirmed",
    timestamp: "1 min ago",
    icon: MdCheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 3,
    type: "shipped",
    title: "Order Shipped",
    description: "Order #ORD-001 - Tracking: TRK123456789",
    timestamp: "Just now",
    icon: MdLocalShipping,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 4,
    type: "new_order",
    title: "New Order #ORD-002",
    description: "Elegant Gold Necklace - Quantity: 1",
    timestamp: "5 mins ago",
    icon: MdShoppingCart,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export default function NotificationModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 3;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, initialLimit);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="notification-panel-backdrop fixed inset-0 bg-black/30 z-[99]" onClick={onClose} />
      <div className="notification-panel-content fixed top-16 right-4 w-full max-w-md bg-white rounded-xl shadow-2xl z-[100] max-h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className="notification-item p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${notification.iconBg} rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={notification.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showAll && notifications.length > initialLimit && (
          <div className="border-t border-gray-200 p-3 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
            >
              View {notifications.length - initialLimit} more notification{notifications.length - initialLimit !== 1 ? "s" : ""}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
