import Link from "next/link";
import Badge from "../common/Badge";

// Database status -> label shown on the dashboard + Badge colour.
const STATUS_STYLES = {
  pending: { label: "New", variant: "default" },
  confirmed: { label: "Confirmed", variant: "info" },
  processing: { label: "Processing", variant: "warning" },
  shipped: { label: "Shipped", variant: "info" },
  out_for_delivery: { label: "Out for delivery", variant: "warning" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  returned: { label: "Returned", variant: "error" },
  refunded: { label: "Refunded", variant: "error" },
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const rupees = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function LatestOrders({ orders, loading }) {
  const list = Array.isArray(orders) ? orders : [];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">Latest Orders</h3>
        <Link
          href="/orders"
          className="text-sm font-semibold whitespace-nowrap"
          style={{ color: "var(--primary)" }}
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="p-6 text-sm text-gray-500">No orders yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {list.map((order) => {
                const style = STATUS_STYLES[order.status] || {
                  label: order.status,
                  variant: "default",
                };
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors align-middle">
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg flex-shrink-0">
                          🧾
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 leading-tight">
                            #{order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-600 leading-tight line-clamp-1">
                            {order.customer}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-xs text-gray-600">
                      <div className="leading-tight whitespace-nowrap">
                        {formatDate(order.date)}
                        <br />
                        {formatTime(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle font-semibold text-gray-900 whitespace-nowrap">
                      {rupees(order.amount)}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Badge variant={style.variant}>{style.label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
