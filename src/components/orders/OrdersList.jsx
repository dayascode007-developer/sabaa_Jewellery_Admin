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
import { importOrdersExcel } from "@/store/slices/bulkOrdersSlice";
import { getStatusCountsApi } from "@/store/api/admOrdersApi";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import AdvancedSearchFilter from "./AdvancedSearchFilter";
import OrderDetailsModal from "./OrderDetailsModal";
import BulkOperationsModal from "./BulkOperationsModal";
import SuccessModal from "@/components/modals/SuccessModal";

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
  const {
    list: orders,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.adminOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    updatedCount: 0,
  });
  const [selectedRecords, setSelectedRecords] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
    returned: 0,
    refunded: 0,
  });

  // Fetch status counts
  const fetchStatusCounts = async () => {
    try {
      const data = await getStatusCountsApi();
      setStatusCounts({
        all: data.total || 0,
        pending: data.counts.pending || 0,
        confirmed: data.counts.confirmed || 0,
        processing: data.counts.processing || 0,
        shipped: data.counts.shipped || 0,
        out_for_delivery: data.counts.out_for_delivery || 0,
        delivered: data.counts.delivered || 0,
        cancelled: data.counts.cancelled || 0,
        returned: data.counts.returned || 0,
        refunded: data.counts.refunded || 0,
      });
    } catch (error) {
      console.error("Failed to fetch status counts:", error);
    }
  };

  // Fetch orders on mount and when filters/pagination changes
  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    console.log("📦 Fetching orders...", { offset, filters, currentPage });
    dispatch(fetchOrders({ limit: ITEMS_PER_PAGE, offset, filters }));
    fetchStatusCounts();
    console.log("📦 Orders loaded! Count:", orders.length);
  }, [dispatch, currentPage, filters, orders.length]);

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

  // Handle individual checkbox
  const handleCheckboxChange = (orderId) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedRecords(newSelected);
  };

  // Handle Select All (page-wise)
  const handleSelectAll = (checked) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      orders.forEach((order) => newSelected.add(order.id));
    } else {
      orders.forEach((order) => newSelected.delete(order.id));
    }
    setSelectedRecords(newSelected);
  };

  // Check if all current page items are selected
  const isPageAllSelected =
    orders.length > 0 && orders.every((order) => selectedRecords.has(order.id));

  // Smart Excel export with selection support
  const handleDownloadExcel = async () => {
    setIsExporting(true);
    try {
      let ordersToExport = [];

      // Priority logic: if records selected, export only those; else export all filtered records
      if (selectedRecords.size > 0) {
        // Export only selected records
        ordersToExport = orders.filter((order) =>
          selectedRecords.has(order.id)
        );
      } else {
        // Export ALL filtered records (fetch complete dataset)
        const allOrdersResult = await dispatch(
          fetchOrders({ limit: 10000, offset: 0, filters }) // Large limit to get all
        );
        ordersToExport = allOrdersResult.payload?.data || orders;
      }

      if (ordersToExport.length === 0) {
        alert("No orders to export");
        setIsExporting(false);
        return;
      }

      const exportData = ordersToExport.map((order) => ({
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
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportExcel = async (file) => {
    try {
      console.log("📊 Excel import started...", file.name);
      const result = await dispatch(importOrdersExcel(file));
      console.log("📊 Excel import result:", result);

      if (result.payload) {
        console.log(
          "✅ Import success! Updated count:",
          result.payload.updatedCount
        );
        // Show success modal immediately
        setSuccessModal({
          isOpen: true,
          updatedCount: result.payload.updatedCount,
        });

        // Refresh orders list and status counts
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        dispatch(fetchOrders({ limit: ITEMS_PER_PAGE, offset, filters }));
        fetchStatusCounts();
      } else if (result.payload === undefined && result.error) {
        console.error("❌ Import failed:", result.error.message);
        alert(`❌ Import failed: ${result.error.message}`);
      }
    } catch (error) {
      console.error("❌ Import error:", error);
      alert("Failed to import orders");
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

  const totalPages = pagination.total
    ? Math.ceil(pagination.total / ITEMS_PER_PAGE)
    : 1;

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
                  ? { backgroundColor: "#E0A75E" }
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
                  console.log("🔵 Status filter clicked:", status.key);
                  setActiveStatusFilter(status.key);
                  setFilters({ status: status.key });
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer shadow-sm ${
                  activeStatusFilter === status.key
                    ? "text-white"
                    : "text-gray-700 bg-gray-200 hover:bg-gray-300"
                }`}
                style={
                  activeStatusFilter === status.key
                    ? { backgroundColor: "#E0A75E" }
                    : {}
                }
              >
                {status.label}{" "}
                <span className="font-semibold">
                  ({statusCounts[status.key] || 0})
                </span>
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
                    disabled={
                      currentPage >= totalPages ||
                      loading ||
                      !pagination.hasMore
                    }
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
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={isPageAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-12">
                    No.
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
                      colSpan="9"
                      className="px-6 py-8 text-center text-gray-600"
                    >
                      {loading ? "Loading orders..." : "No orders found"}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.purchase_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td
                        className="px-6 py-4 w-12"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="rounded cursor-pointer"
                          checked={selectedRecords.has(order.id)}
                          onChange={() => handleCheckboxChange(order.id)}
                        />
                      </td>
                      <td className="px-6 py-4 w-12 text-sm text-gray-600 font-medium">
                        {pagination.offset + index + 1}
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
            onUpdate={handleImportExcel}
            isExporting={isExporting}
            selectedCount={selectedRecords.size}
          />

          {/* Success Modal */}
          <SuccessModal
            isOpen={successModal.isOpen}
            onClose={() => setSuccessModal({ isOpen: false, updatedCount: 0 })}
            title="Orders Updated Successfully"
            message={`Successfully updated ${successModal.updatedCount} order(s)`}
            buttonText="Done"
          />
        </>
      )}
    </>
  );
}
