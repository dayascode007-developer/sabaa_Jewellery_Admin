"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdShoppingCart, MdCheckCircle, MdLocalShipping, MdError, MdInfo } from "react-icons/md";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification as deleteNotif } from "@/store/slices/adminNotificationsSlice";
import { formatDistanceToNow } from "date-fns";

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

const getNotificationIcon = (type) => {
  const iconMap = {
    order_placed: { icon: MdShoppingCart, bg: "bg-blue-100", color: "text-blue-600" },
    payment_received: { icon: MdCheckCircle, bg: "bg-green-100", color: "text-green-600" },
    order_shipped: { icon: MdLocalShipping, bg: "bg-purple-100", color: "text-purple-600" },
    order_delivered: { icon: MdCheckCircle, bg: "bg-green-100", color: "text-green-600" },
    payment_failed: { icon: MdError, bg: "bg-red-100", color: "text-red-600" },
  };
  return iconMap[type] || { icon: MdInfo, bg: "bg-gray-100", color: "text-gray-600" };
};

const formatTime = (timestamp) => {
  if (!timestamp) return "just now";
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export default function NotificationModal({ isOpen, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { list: notifications, loading } = useSelector((state) => state.adminNotifications);
  const [showAll, setShowAll] = useState(false);
  const initialLimit = 3;
  const displayedNotifications = showAll ? notifications : notifications.slice(0, initialLimit);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 50 }));
    }
  }, [isOpen, dispatch]);

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.is_read) {
      dispatch(markNotificationAsRead(notification.id));
    }

    // Navigate to orders page
    onClose();
    router.push(`/orders`);
  };

  const handleMarkAsRead = (notificationId, e) => {
    e?.stopPropagation();
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleDelete = (notificationId, e) => {
    e?.stopPropagation();
    dispatch(deleteNotif(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="notification-panel-backdrop fixed inset-0 bg-black/30 z-[99]" onClick={onClose} />
      <div className="notification-panel-content fixed top-16 right-4 w-full max-w-md bg-white rounded-xl shadow-2xl z-[100] max-h-[calc(100vh-100px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && notifications.some((n) => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              >
                Read All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <MdClose size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification) => {
              const { icon: Icon, bg, color } = getNotificationIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`notification-item p-4 rounded-xl border transition-all cursor-pointer group ${
                    notification.is_read
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 ${bg} rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Mark as read"
                        >
                          <MdCheckCircle size={16} className="text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDelete(notification.id, e)}
                        className="p-1 hover:bg-red-200 rounded transition-colors"
                        title="Delete"
                      >
                        <MdClose size={16} className="text-red-500" />
                      </button>
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
