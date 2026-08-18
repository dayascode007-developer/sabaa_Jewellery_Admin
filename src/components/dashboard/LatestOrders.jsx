import Badge from "../common/Badge";

export default function LatestOrders() {
  const orders = [
    {
      id: "#SBAA1001",
      product: "Meena Lakshmi Ring",
      icon: "💍",
      date: "29 Jul 2026",
      time: "10:30 AM",
      amount: "₹2,950",
      status: "New",
    },
    {
      id: "#SBAA1002",
      product: "Panchaloga Chain 22 Inch",
      icon: "⛓️",
      date: "29 Jul 2026",
      time: "09:45 AM",
      amount: "₹6,200",
      status: "Confirmed",
    },
    {
      id: "#SBAA1003",
      product: "Traditional Jimikki",
      icon: "👂",
      date: "29 Jul 2026",
      time: "09:15 AM",
      amount: "₹1,800",
      status: "Processing",
    },
    {
      id: "#SBAA1004",
      product: "Panchaloga Bracelets",
      icon: "💪",
      date: "29 Jul 2026",
      time: "08:50 AM",
      amount: "₹3,450",
      status: "Shipped",
    },
  ];

  const statusColors = {
    New: "default",
    Confirmed: "info",
    Processing: "warning",
    Shipped: "success",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          Latest Orders
        </h3>
        <a
          href="#"
          className="text-sm font-semibold whitespace-nowrap"
          style={{ color: "var(--primary)" }}
        >
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors align-middle"
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg flex-shrink-0">
                      {order.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 leading-tight">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-600 leading-tight">
                        {order.product}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-middle text-xs text-gray-600">
                  <div className="leading-tight">
                    {order.date}
                    <br />
                    {order.time}
                  </div>
                </td>
                <td className="px-6 py-4 align-middle font-semibold text-gray-900">
                  {order.amount}
                </td>
                <td className="px-6 py-4 align-middle">
                  <Badge variant={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
