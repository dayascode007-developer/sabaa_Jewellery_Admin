"use client";

import { useState } from "react";
import { MdClose, MdFilterList } from "react-icons/md";
import CustomDropdown from "../common/CustomDropdown";

export default function AdvancedSearchFilter({
  onFilterChange,
  categories = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    stockStatus: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    const emptyFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      stockStatus: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v).length;

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{ backgroundColor: "var(--primary)" }}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-full hover:opacity-90 active:opacity-80 transition-all cursor-pointer shadow-sm"
      >
        <MdFilterList size={18} />
        Advanced Filters
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2.5 py-0.5 text-xs font-semibold text-white bg-white/30 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/100 backdrop-blur-sm rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200/50">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 sticky top-0 bg-white/50 backdrop-blur-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Advanced Search Filters
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors cursor-pointer"
                title="Close"
              >
                <MdClose size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Filters Content */}
            <div className="p-6 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search by title or SKU..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black placeholder-gray-400 hover:border-gray-400 transition-colors cursor-text"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Category */}
              <CustomDropdown
                label="Category"
                options={[{ id: "", name: "All Categories" }, ...categories]}
                value={filters.category}
                onChange={(value) => handleFilterChange("category", value)}
                placeholder="Select Category"
              />

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Min Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black placeholder-gray-400 hover:border-gray-400 transition-colors cursor-text"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                    Max Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="999999"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black placeholder-gray-400 hover:border-gray-400 transition-colors cursor-text"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  />
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                  Stock Status
                </label>
                <div className="relative">
                  <select
                    value={filters.stockStatus}
                    onChange={(e) =>
                      handleFilterChange("stockStatus", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black hover:border-gray-400 transition-colors cursor-pointer appearance-none bg-white pr-10"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  >
                    <option value="">All</option>
                    <option value="in-stock">In Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer with Actions */}
            <div className="flex gap-4 p-6 border-t border-white/20 bg-white/50 backdrop-blur-sm">
              <button
                onClick={handleClear}
                className="flex-1 px-6 py-2.5 text-gray-700 font-semibold rounded-full border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 active:opacity-80 transition-all duration-200 cursor-pointer"
              >
                Clear
              </button>
              <button
                onClick={handleApply}
                style={{ backgroundColor: "var(--primary)" }}
                className="flex-1 px-6 py-2.5 text-white font-semibold rounded-full hover:opacity-90 active:opacity-80 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
