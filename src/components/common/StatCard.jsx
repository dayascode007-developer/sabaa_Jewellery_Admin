export default function StatCard({
  icon: Icon,
  label,
  value,
  change,
  unit = "",
  bgColor = "from-[#F3E8F4] to-[#F9F5F8]",
  iconColor = "text-gray-600",
}) {
  const isNegative = change < 0;
  const isIconComponent = typeof Icon === "function";
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-16 h-16 bg-linear-to-br ${bgColor} rounded-4xl flex items-center justify-center shrink-0`}
        >
          {isIconComponent ? (
            <Icon className={`w-8 h-8 ${iconColor}`} />
          ) : (
            <span className="text-2xl">{Icon}</span>
          )}
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {unit}
            {value}
          </p>
          {change !== undefined && (
            <p className="text-xs mt-2 whitespace-nowrap">
              <span className={isNegative ? "text-red-500" : "text-green-500"}>{isNegative ? "▼" : "▲"} {Math.abs(change)}%</span>
              <span className="text-gray-600"> vs yesterday</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
