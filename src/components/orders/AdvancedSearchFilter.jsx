"use client";

import { useMemo, useState, useEffect } from "react";
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

const getAvailableProviders = (orders) => {
  const providers = new Set();
  orders.forEach((order) => {
    if (order.courier_name) {
      providers.add(order.courier_name);
    }
  });
  return Array.from(providers).sort();
};

const getAvailableYears = (orders) => {
  const years = new Set();
  orders.forEach((order) => {
    const date = new Date(order.created_at);
    years.add(date.getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
};

const getMonthsForYear = (selectedYear) => {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const key = `${selectedYear}-${String(month + 1).padStart(2, "0")}`;
    const label = new Date(selectedYear, month).toLocaleDateString("en-US", {
      month: "long",
    });
    months.push({ value: key, label });
  }
  return months;
};

export default function AdvancedSearchFilter({
  filters,
  setFilters,
  onClose,
  onApply,
  orders = [],
}) {
  const [selectedYear, setSelectedYear] = useState(
    filters.date ? filters.date.split("-")[0] : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    filters.date ? filters.date.split("-")[1] : ""
  );
  const [availableProvidersData, setAvailableProvidersData] = useState([]);

  useEffect(() => {
    if (filters.date) {
      const [year, month] = filters.date.split("-");
      setSelectedYear(year);
      setSelectedMonth(month);
    }
  }, []);

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/couriers`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setAvailableProvidersData(data.data || []);
      } catch (error) {
        console.error("Failed to fetch couriers:", error);
      }
    };

    fetchCouriers();
  }, []);

  const availableYears = useMemo(() => {
    const years = getAvailableYears(orders);
    if (selectedYear && !years.includes(parseInt(selectedYear))) {
      years.push(parseInt(selectedYear));
      years.sort((a, b) => b - a);
    }
    return years;
  }, [orders, selectedYear]);

  const availableMonths = useMemo(
    () => (selectedYear ? getMonthsForYear(parseInt(selectedYear)) : []),
    [selectedYear]
  );

  const availableProviders = useMemo(
    () => availableProvidersData.length > 0 ? availableProvidersData : getAvailableProviders(orders),
    [availableProvidersData, orders]
  );

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedMonth("");
  };

  const handleMonthChange = (monthValue) => {
    if (monthValue) {
      setSelectedMonth(monthValue.split("-")[1]);
      setFilters(prev => ({
        ...prev,
        date: monthValue,
      }));
    } else {
      setSelectedMonth("");
      setFilters(prev => ({
        ...prev,
        date: "",
      }));
    }
  };

  const handleStatusChange = (status) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status === status ? "" : status,
    }));
  };

  const handleClearAll = () => {
    setFilters({});
    setSelectedYear("");
    setSelectedMonth("");
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
          {/* Year Filter */}
          <div>
            <CustomDropdown
              label="Year"
              options={[
                { id: "", name: "All years" },
                ...availableYears.map((year) => ({
                  id: year.toString(),
                  name: year.toString(),
                })),
              ]}
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Select year"
            />
          </div>

          {/* Month Filter */}
          <div>
            <CustomDropdown
              label="Month"
              options={
                !selectedYear
                  ? [{ id: "", name: "Please choose year first" }]
                  : [
                      { id: "", name: "All months" },
                      ...availableMonths.map((month) => ({
                        id: month.value,
                        name: month.label,
                      })),
                    ]
              }
              value={filters.date || ""}
              onChange={handleMonthChange}
              placeholder={selectedYear ? "Select month" : "Please choose year first"}
              disabled={!selectedYear}
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
                ...availableProviders.map((provider) => ({
                  id: provider,
                  name: provider,
                })),
              ]}
              value={filters.shippingProvider || ""}
              onChange={(value) => {
                setFilters(prev => ({
                  ...prev,
                  shippingProvider: value,
                }));
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
