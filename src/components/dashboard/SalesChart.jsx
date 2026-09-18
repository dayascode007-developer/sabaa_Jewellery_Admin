"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Amounts come from the API in rupees. Big numbers are shown in lakhs (₹1.2L),
// smaller ones in thousands (₹8.5k), so a new store's chart is still readable.
const axisFormatter = (max) => {
  if (max >= 100000) return (value) => `₹${(value / 100000).toFixed(1)}L`;
  if (max >= 1000) return (value) => `₹${(value / 1000).toFixed(1)}k`;
  return (value) => `₹${value}`;
};

const fullRupees = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function SalesChart({ data, period = "monthly", onPeriodChange, loading }) {
  const series = Array.isArray(data) ? data : [];
  const max = series.reduce((m, point) => Math.max(m, Number(point.value) || 0), 0);

  return (
    <div className=" p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <select
          value={period}
          onChange={(e) => onPeriodChange?.(e.target.value)}
          className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:border-gray-300"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[260px] animate-pulse rounded-lg bg-gray-100" />
      ) : series.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-gray-500">
          No sales yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={series} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" stroke="#999" strokeWidth={1} style={{ fontSize: "12px" }} />
            <YAxis
              stroke="#999"
              strokeWidth={1}
              style={{ fontSize: "12px" }}
              tickFormatter={axisFormatter(max)}
            />
            <Tooltip
              formatter={(value) => [fullRupees(value), "Sales"]}
              contentStyle={{ borderRadius: 8, border: "1px solid #eee", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#E91E63"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={{ fill: "#E91E63", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
