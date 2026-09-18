import Link from "next/link";

export default function InventoryAlerts({ alerts, loading }) {
  const list = Array.isArray(alerts) ? alerts : [];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
        <Link href="/inventory" className="text-purple-600 text-sm font-medium hover:text-purple-700">
          View All
        </Link>
      </div>
      <div className="p-6 space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
            </div>
          ))
        ) : list.length === 0 ? (
          <p className="text-sm text-gray-500">All products are well stocked</p>
        ) : (
          list.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg shrink-0">
                💍
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{alert.name}</p>
                <p className="text-xs text-gray-500">
                  {alert.stock} in stock
                  {alert.threshold ? ` · alert below ${alert.threshold}` : ""}
                </p>
              </div>
              {alert.status === "critical" ? (
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded whitespace-nowrap">
                  Critical
                </span>
              ) : (
                <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded whitespace-nowrap">
                  Low
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
