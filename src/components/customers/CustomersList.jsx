"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdChevronLeft, MdChevronRight, MdSearch, MdDownload, MdKeyboardArrowDown } from "react-icons/md";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { fetchCustomers, fetchCustomersForDownload } from "@/store/slices/customersSlice";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 10;

const MONTHS = [
  { value: "", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function CustomersList() {
  const dispatch = useDispatch();
  const { customers, total, loading, downloadLoading } = useSelector((state) => state.customers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const debounceTimer = useRef(null);
  const monthDropdownRef = useRef(null);

  // Only show skeleton on very first load, not on subsequent searches with no results
  const isInitialLoading = loading && !hasLoaded;

  // Set hasLoaded flag when data first loads
  useEffect(() => {
    if (!loading && customers.length > 0 && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [loading, customers.length, hasLoaded]);

  // Close month dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target)) {
        setMonthDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search term changes
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm]);

  // Fetch customers when debounced search term, month, or page changes
  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(
      fetchCustomers({
        limit: ITEMS_PER_PAGE,
        offset,
        filters: { search: debouncedSearchTerm, month: selectedMonth },
      })
    );
  }, [dispatch, currentPage, debouncedSearchTerm, selectedMonth]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadExcel = async () => {
    try {
      const result = await dispatch(
        fetchCustomersForDownload({ filters: { search: searchTerm, month: selectedMonth } })
      ).unwrap();

      if (!result || result.length === 0) {
        alert("No customers to download");
        return;
      }

      const exportData = result.map((customer, index) => ({
        "No.": index + 1,
        "Customer Name": customer.name || "—",
        Email: customer.email || "—",
        Phone: customer.phone || "—",
        Street: customer.address?.street || "—",
        City: customer.address?.city || "—",
        State: customer.address?.state || "—",
        "Postal Code": customer.address?.postalCode || "—",
        "Register Date": formatDate(customer.registeredat),
        Orders: customer.orderscount || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      const monthLabel = selectedMonth ? MONTHS.find(m => m.value === selectedMonth)?.label : "";
      const filenameParts = ["Customers"];
      if (monthLabel) filenameParts.push(monthLabel);
      if (searchTerm) filenameParts.push(searchTerm);
      filenameParts.push(new Date().getTime());
      const fileName = `${filenameParts.join("_")}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      alert("Failed to download customers");
    }
  };

  return (
    <>
      {isInitialLoading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <>
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage customer data and details</p>
          </div>

          {/* Search Bar, Month Filter and Download Button */}
          <div className="mb-6 flex gap-3 items-center">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black bg-white"
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
            </div>

            {/* Custom Month Dropdown */}
            <div className="relative w-32" ref={monthDropdownRef}>
              <button
                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg flex items-center justify-between text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
                style={{ "--tw-ring-color": "var(--primary)" }}
              >
                <span className="text-sm font-medium">
                  {MONTHS.find(m => m.value === selectedMonth)?.label || "All Months"}
                </span>
                <MdKeyboardArrowDown
                  size={18}
                  className={`transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {monthDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {MONTHS.map((month) => (
                    <button
                      key={month.value}
                      onClick={() => {
                        setSelectedMonth(month.value);
                        setCurrentPage(1);
                        setMonthDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all ${
                        selectedMonth === month.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {month.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadExcel}
              disabled={downloadLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all whitespace-nowrap"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <MdDownload size={20} />
              {downloadLoading ? "Downloading..." : "Download"}
            </button>
          </div>

          {/* Month-wise Stats */}
          {selectedMonth && (
            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4" style={{ borderColor: "var(--primary)" }}>
                <p className="text-sm text-gray-600 mb-1">Customers (This Month)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(customers) ? customers.length : 0}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4" style={{ borderColor: "var(--primary)" }}>
                <p className="text-sm text-gray-600 mb-1">Total Orders (This Month)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(customers) ? customers.reduce((sum, c) => sum + (c.orderscount || 0), 0) : 0}
                </p>
              </div>
            </div>
          )}

          {/* Customers Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header with Pagination */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Customers
              </h2>

              <div className="flex items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  {total > 0
                    ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, total)} of ${total}`
                    : "No customers"}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, Math.ceil(total / ITEMS_PER_PAGE))
                      )
                    }
                    disabled={currentPage >= Math.ceil(total / ITEMS_PER_PAGE)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12">
                    No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Customer Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Register Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!Array.isArray(customers) || customers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-600"
                    >
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-600 w-12">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {customer.name || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {customer.email || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {customer.phone || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {customer.address?.street || customer.address?.city || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(customer.registeredat)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {customer.orderscount || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
