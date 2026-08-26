"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdChevronLeft, MdChevronRight, MdSearch, MdDownload } from "react-icons/md";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { fetchCustomers, fetchCustomersForDownload } from "@/store/slices/customersSlice";
import * as XLSX from "xlsx";

const ITEMS_PER_PAGE = 10;

export default function CustomersList() {
  const dispatch = useDispatch();
  const { customers, total, loading, downloadLoading } = useSelector((state) => state.customers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Distinguish between initial loading and pagination fetching
  const isInitialLoading = loading && customers.length === 0;

  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(
      fetchCustomers({
        limit: ITEMS_PER_PAGE,
        offset,
        filters: { search: searchTerm },
      })
    );
  }, [dispatch, currentPage, searchTerm]);

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
        fetchCustomersForDownload({ filters: { search: searchTerm } })
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
        Address: customer.address || "—",
        "Register Date": formatDate(customer.registeredat),
        Orders: customer.orderscount || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

      const fileName = searchTerm
        ? `Customers_${searchTerm}_${new Date().getTime()}.xlsx`
        : `Customers_${new Date().getTime()}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Download error:", error);
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

          {/* Search Bar and Download Button */}
          <div className="mb-6 flex gap-3">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                style={{ "--tw-ring-color": "var(--primary)" }}
              />
            </div>
            <button
              onClick={handleDownloadExcel}
              disabled={downloadLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <MdDownload size={20} />
              {downloadLoading ? "Downloading..." : "Download"}
            </button>
          </div>

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
                          {customer.address || "—"}
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
