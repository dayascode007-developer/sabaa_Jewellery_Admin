import Link from "next/link";

export default function InventoryAlerts() {
  const alerts = [
    { name: "Panchaloga Lakshmi Ring (Size 20)", stock: 2, icon: "💍", status: "low" },
    { name: "Traditional Jimikki", stock: 1, icon: "👂", status: "critical" },
    { name: "Panchaloga Bracelet", stock: 3, icon: "💪", status: "low" },
    { name: "Panchaloga Anklet", stock: 2, icon: "🦶", status: "low" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
        <Link href="/inventory" className="text-purple-600 text-sm font-medium hover:text-purple-700">
          View All
        </Link>
      </div>
      <div className="p-6 space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg">
              {alert.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{alert.name}</p>
              <p className="text-xs text-gray-500">{alert.stock} in stock</p>
            </div>
            {alert.status === "critical" ? (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">
                Critical
              </span>
            ) : (
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                Low
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
