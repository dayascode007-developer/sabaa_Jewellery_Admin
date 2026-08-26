"use client";

import { useMemo } from "react";
import { MdClose } from "react-icons/md";
import CustomDropdown from "@/components/common/CustomDropdown";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Processing", label: "Processing" },
  { value: "Shipped", label: "Shipped" },
  { value: "Completed", label: "Completed" },
  { value: "Failed", label: "Failed" },
  { value: "Cancelled", label: "Cancelled" },
];

const SHIPPING_PROVIDER_OPTIONS = [
  { value: "Delhivery", label: "Delhivery" },
  { value: "India Post", label: "India Post" },
  { value: "DTDC", label: "DTDC" },
  { value: "DTDC Plus", label: "DTDC Plus" },
  { value: "The Professional Couriers", label: "The Professional Couriers" },
  { value: "ST Courier", label: "ST Courier" },
  { value: "Amazon Shipping IN", label: "Amazon Shipping IN" },
];

const getAvailableMonths = (orders) => {
  const years = new Set();
  orders.forEach((order) => {
    const date = new Date(order.date);
    years.add(date.getFullYear());
  });

  const months = [];
  const sortedYears = Array.from(years).sort((a, b) => b - a);

  sortedYears.forEach((year) => {
    for (let month = 11; month >= 0; month--) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}`;
      const label = new Date(year, month).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      months.push({ value: key, label });
    }
  });

  return months;
};

export default function AdvancedSearchFilter({
  filters,
  setFilters,
  onClose,
  onApply,
  orders = [],
}) {
  const availableMonths = useMemo(() => getAvailableMonths(orders), [orders]);

  const handleStatusChange = (status) => {
    setFilters({
      ...filters,
      status: filters.status === status ? "" : status,
    });
  };

  const handleDateChange = (date) => {
    setFilters({
      ...filters,
      date: filters.date === date ? "" : date,
    });
  };

  const handleClearAll = () => {
    setFilters({});
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Advanced Filter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="space-y-6">
          {/* Date Filter */}
          <div>
            <CustomDropdown
              label="Date"
              options={[
                { id: "", name: "All dates" },
                ...availableMonths.map((month) => ({
                  id: month.value,
                  name: month.label,
                })),
              ]}
              value={filters.date || ""}
              onChange={handleDateChange}
              placeholder="Select date"
            />
          </div>

          {/* Status Filter */}
          <div>
            <CustomDropdown
              label="Status"
              options={[
                { id: "", name: "All statuses" },
                ...STATUS_OPTIONS.map((option) => ({
                  id: option.value,
                  name: option.label,
                })),
              ]}
              value={filters.status || ""}
              onChange={handleStatusChange}
              placeholder="Select status"
            />
          </div>

          {/* Shipping Provider Filter */}
          <div>
            <CustomDropdown
              label="Shipping Provider"
              options={[
                { id: "", name: "All providers" },
                ...SHIPPING_PROVIDER_OPTIONS.map((option) => ({
                  id: option.value,
                  name: option.label,
                })),
              ]}
              value={filters.shippingProvider || ""}
              onChange={(value) => {
                setFilters({
                  ...filters,
                  shippingProvider: value,
                });
              }}
              placeholder="Select provider"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleClearAll}
            className="flex-1 px-5 py-2.5 border border-gray-300 rounded-full text-gray-900 font-medium hover:bg-gray-50 transition-all cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-5 py-2.5 rounded-full text-white font-medium hover:opacity-90 transition-all cursor-pointer"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
