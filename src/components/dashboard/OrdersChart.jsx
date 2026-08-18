export default function OrdersChart() {
  const statuses = [
    { name: "New", value: 28, color: "bg-purple-500" },
    { name: "Confirmed", value: 32, color: "bg-blue-500" },
    { name: "Processing", value: 45, color: "bg-cyan-500" },
    { name: "Shipped", value: 51, color: "bg-yellow-500" },
    { name: "Delivered", value: 30, color: "bg-teal-500" },
    { name: "Cancelled", value: 0, color: "bg-red-500" },
  ];

  const total = 186;

  return (
    <div className="p-6 ">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Orders by Status
        </h3>
      </div>

      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Simplified donut chart representation */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="20"
              strokeDasharray="47 408"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="20"
              strokeDasharray="85 408"
              strokeDashoffset="-47"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="20"
              strokeDasharray="120 408"
              strokeDashoffset="-132"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#EAB308"
              strokeWidth="20"
              strokeDasharray="136 408"
              strokeDashoffset="-252"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="20"
              strokeDasharray="80 408"
              strokeDashoffset="-388"
            />
          </svg>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {statuses.map((status) => (
          <div
            key={status.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
              <span className="text-gray-700">{status.name}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {status.value} ({Math.round((status.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
