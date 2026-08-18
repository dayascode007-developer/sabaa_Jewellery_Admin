"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function SalesChart() {
  const data = [
    { month: "Jan", value: 6 },
    { month: "Feb", value: 12 },
    { month: "Mar", value: 10 },
    { month: "Apr", value: 15 },
    { month: "May", value: 12 },
    { month: "Jun", value: 18 },
    { month: "Jul", value: 24 },
  ];

  return (
    <div className=" p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
        <select className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:border-gray-300">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E91E63" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#E91E63" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            stroke="#999"
            strokeWidth={1}
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#999"
            strokeWidth={1}
            style={{ fontSize: "12px" }}
            tickFormatter={(value) => `₹${value}L`}
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
    </div>
  );
}
