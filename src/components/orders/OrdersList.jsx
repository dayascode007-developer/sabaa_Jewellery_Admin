"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "@/store/slices/adminOrdersSlice";
import {
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdVisibility,
  MdTune,
} from "react-icons/md";
import { PiMicrosoftExcelLogoLight } from "react-icons/pi";

import * as XLSX from "xlsx";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import AdvancedSearchFilter from "./AdvancedSearchFilter";
import OrderDetailsModal from "./OrderDetailsModal";
import BulkOperationsModal from "./BulkOperationsModal";

const ITEMS_PER_PAGE = 10;


const getStatusColor = (status) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-orange-100 text-orange-800",
    shipped: "bg-purple-100 text-purple-800",
    out_for_delivery: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    returned: "bg-pink-100 text-pink-800",
    refunded: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    returned: "Returned",
    refunded: "Refunded",
  };
  return labels[status] || status;
};

export default function OrdersList() {
  const dispatch = useDispatch();
  const { list: orders, pagination, loading, error } = useSelector((state) => state.adminOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);

  // Fetch orders on mount and when filters/pagination changes
  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(fetchOrders({ limit: ITEMS_PER_PAGE, offset, filters }));
  }, [dispatch, currentPage, filters]);

  // Calculate status counts from API response
  const statusCounts = {
    all: pagination.total || 0,
    pending: 0,
    shipped: 0,
    out_for_delivery: 0,
    delivered: 0,
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDownloadExcel = () => {
    try {
      const exportData = orders.map((order) => ({
        "Order ID": order.id,
        "Purchase ID": order.purchase_id,
        "Customer Name": order.customer.name,
        Date: formatDate(order.created_at),
        Status: getStatusLabel(order.status),
        Total: `₹${parseFloat(order.total_amount).toFixed(2)}`,
        "Shipment Tracking": order.tracking_number || "—",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      const fileName = `Orders_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download orders");
    }
  };

  // Client-side filtering for search and dynamic filters
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.purchase_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalPages = pagination.total ? Math.ceil(pagination.total / ITEMS_PER_PAGE) : 1;

  return (
    <>
      {loading && orders.length === 0 ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders</p>
          </div>

          {/* Search Bar and Filter Button */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative max-w-[70%] w-full">
              <MdSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
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
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 min-w-[95px] rounded-full text-white font-medium hover:opacity-90 cursor-pointer transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <MdTune size={18} />
              <span>Filter</span>
            </button>
            <button
              onClick={() => setBulkOperationsOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 min-w-[130px] rounded-full text-white font-medium hover:opacity-90 cursor-pointer transition-all"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <PiMicrosoftExcelLogoLight size={18} />
              <span>Bulk Operations</span>
            </button>
          </div>

          {/* Status Filter Bar */}
          <div className="mb-6 flex flex-wrap gap-3 p-4 bg-gray-100 rounded-lg">
            <button
              onClick={() => {
                setActiveStatusFilter("all");
                setFilters({});
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeStatusFilter === "all"
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={
                activeStatusFilter === "all"
                  ? { backgroundColor: "var(--primary)" }
                  : {}
              }
            >
              All <span className="font-semibold">({statusCounts.all})</span>
            </button>
            {[
              { key: "pending", label: "Pending" },
              { key: "confirmed", label: "Confirmed" },
              { key: "processing", label: "Processing" },
              { key: "shipped", label: "Shipped" },
              { key: "out_for_delivery", label: "Out for Delivery" },
              { key: "delivered", label: "Delivered" },
              { key: "cancelled", label: "Cancelled" },
              { key: "returned", label: "Returned" },
              { key: "refunded", label: "Refunded" },
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => {
                  setActiveStatusFilter(status.key);
                  setFilters({ status: status.key });
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeStatusFilter === status.key
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeStatusFilter === status.key
                    ? { backgroundColor: "var(--primary)" }
                    : {}
                }
              >
                {status.label}{" "}
                <span className="font-semibold">({statusCounts[status.key] || 0})</span>
              </button>
            ))}
          </div>

          {/* Advanced Search Filter Modal */}
          {filterOpen && (
            <AdvancedSearchFilter
              filters={filters}
              setFilters={setFilters}
              onClose={() => setFilterOpen(false)}
              onApply={() => {
                setCurrentPage(1);
              }}
              orders={orders}
            />
          )}

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header with Pagination */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                All Orders
              </h2>

              <div className="flex items-center gap-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600">
                  {orders.length > 0
                    ? `${pagination.offset + 1}-${Math.min(
                        pagination.offset + orders.length,
                        pagination.total
                      )} of ${pagination.total}`
                    : "No orders"}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1 || loading}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages || loading || !pagination.hasMore}
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
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Purchase ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Shipment Tracking
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Origin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-600"
                    >
                      {loading ? "Loading orders..." : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.purchase_id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 w-12">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p
                            className="text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                            onClick={() => setSelectedOrder(order)}
                          >
                            #{order.id}
                          </p>
                          <MdVisibility
                            size={14}
                            className="text-blue-400 cursor-pointer hover:text-blue-600 flex-shrink-0"
                            onClick={() => setSelectedOrder(order)}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {order.customer.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.purchase_id}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(parseFloat(order.total_amount))}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {order.courier_name && order.tracking_number
                            ? `${order.courier_name} - ${order.tracking_number}`
                            : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {order.payment_method === "cod" ? "COD" : "Online"}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}

          {/* Bulk Operations Modal */}
          <BulkOperationsModal
            isOpen={bulkOperationsOpen}
            onClose={() => setBulkOperationsOpen(false)}
            onExport={handleDownloadExcel}
            onUpdate={() => {
              // TODO: Add bulk update functionality
            }}
          />
        </>
      )}
    </>
  );
}
