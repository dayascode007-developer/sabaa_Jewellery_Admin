"use client";

// The six statuses from the design are always listed; the rest only appear once
// an order actually reaches them, so the legend stays short for most stores.
const BASE_STATUSES = [
  { key: "pending", name: "New", dot: "bg-purple-500", stroke: "#8B5CF6" },
  { key: "confirmed", name: "Confirmed", dot: "bg-blue-500", stroke: "#3B82F6" },
  { key: "processing", name: "Processing", dot: "bg-cyan-500", stroke: "#06B6D4" },
  { key: "shipped", name: "Shipped", dot: "bg-yellow-500", stroke: "#EAB308" },
  { key: "delivered", name: "Delivered", dot: "bg-teal-500", stroke: "#14B8A6" },
  { key: "cancelled", name: "Cancelled", dot: "bg-red-500", stroke: "#EF4444" },
];

const EXTRA_STATUSES = [
  { key: "out_for_delivery", name: "Out for delivery", dot: "bg-indigo-500", stroke: "#6366F1" },
  { key: "returned", name: "Returned", dot: "bg-orange-500", stroke: "#F97316" },
  { key: "refunded", name: "Refunded", dot: "bg-gray-400", stroke: "#9CA3AF" },
];

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function OrdersChart({ counts, loading }) {
  const data = counts || {};
  const statuses = [
    ...BASE_STATUSES,
    ...EXTRA_STATUSES.filter((status) => Number(data[status.key]) > 0),
  ].map((status) => ({ ...status, value: Number(data[status.key]) || 0 }));

  const total = statuses.reduce((sum, status) => sum + status.value, 0);

  // Each slice starts where the previous one ended; offsets are negative in SVG.
  let offset = 0;
  const segments = statuses
    .filter((status) => status.value > 0)
    .map((status) => {
      const length = total ? (status.value / total) * CIRCUMFERENCE : 0;
      const segment = { ...status, length, offset };
      offset += length;
      return segment;
    });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Orders by Status</h3>
      </div>

      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{loading ? "..." : total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Track, so an empty store still shows a ring */}
            <circle cx="100" cy="100" r={RADIUS} fill="none" stroke="#F3F4F6" strokeWidth="20" />
            {segments.map((segment) => (
              <circle
                key={segment.key}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke={segment.stroke}
                strokeWidth="20"
                strokeDasharray={`${segment.length} ${CIRCUMFERENCE - segment.length}`}
                strokeDashoffset={-segment.offset}
                transform="rotate(-90 100 100)"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {statuses.map((status) => (
          <div key={status.key} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status.dot}`}></div>
              <span className="text-gray-700">{status.name}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {status.value} ({total ? Math.round((status.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
