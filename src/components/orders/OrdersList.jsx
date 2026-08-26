"use client";

import { useState } from "react";
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

const MOCK_ORDERS = [
  {
    id: 36,
    orderNumber: "#35",
    purchaseId: "W240861A2",
    customerName: "Rajesh Kumar",
    date: "2026-08-24",
    status: "Completed",
    total: 2199.0,
    shipmentTracking: "TRK123456790",
    origin: "Direct",
    shippingProvider: "Delhivery",
  },
  {
    id: 35,
    orderNumber: "#36",
    purchaseId: "W240861A2",
    customerName: "Rajesh Kumar",
    date: "2026-08-24",
    status: "Completed",
    total: 2499.0,
    shipmentTracking: "TRK123456789",
    origin: "Direct",
  },
  {
    id: 34,
    orderNumber: "#34",
    purchaseId: "W220862B1",
    customerName: "Priya Sharma",
    date: "2026-08-22",
    status: "Shipped",
    total: 1850.5,
    shipmentTracking: "TRK987654321",
    origin: "Organic: Google",
  },
  {
    id: 33,
    orderNumber: "#33",
    purchaseId: "W200863C2",
    customerName: "Amit Patel",
    date: "2026-08-20",
    status: "Shipped",
    total: 3250.0,
    shipmentTracking: "TRK555666777",
    origin: "Organic: Facebook",
  },
  {
    id: 32,
    orderNumber: "#32",
    purchaseId: "W180864D1",
    customerName: "Sneha Desai",
    date: "2026-08-18",
    status: "Processing",
    total: 1299.99,
    shipmentTracking: "—",
    origin: "Paid Ads",
  },
  {
    id: 31,
    orderNumber: "#31",
    purchaseId: "W290762E1",
    customerName: "dsaba jewelarts venkat",
    date: "2026-07-29",
    status: "Cancelled",
    total: 1044.0,
    shipmentTracking: "—",
    origin: "Direct",
  },
  {
    id: 30,
    orderNumber: "#30",
    purchaseId: "W250762F1",
    customerName: "maya Harshan",
    date: "2026-07-25",
    status: "Failed",
    total: 10.0,
    shipmentTracking: "—",
    origin: "Organic: Google",
  },
  {
    id: 29,
    orderNumber: "#29",
    purchaseId: "W250763G1",
    customerName: "N G Loganathan",
    date: "2026-07-25",
    status: "Failed",
    total: 10.0,
    shipmentTracking: "—",
    origin: "Organic: Google",
  },
  {
    id: 28,
    orderNumber: "#28",
    purchaseId: "W250764H1",
    customerName: "N G Loganathan",
    date: "2026-07-25",
    status: "Failed",
    total: 10.0,
    shipmentTracking: "—",
    origin: "Organic: Google",
  },
  {
    id: 27,
    orderNumber: "#27",
    purchaseId: "W200762I1",
    customerName: "Vinayaga Moorthy",
    date: "2026-07-20",
    status: "Processing",
    total: 10.0,
    shipmentTracking: "—",
    origin: "Organic: Google",
  },
  {
    id: 26,
    orderNumber: "#26",
    purchaseId: "W180761J1",
    customerName: "Vikram Singh",
    date: "2026-07-18",
    status: "Shipped",
    total: 5890.0,
    shipmentTracking: "TRK444555666",
    origin: "Direct",
  },
  {
    id: 25,
    orderNumber: "#25",
    purchaseId: "W150761K1",
    customerName: "Anjali Verma",
    date: "2026-07-15",
    status: "Completed",
    total: 2150.25,
    shipmentTracking: "TRK111222333",
    origin: "Organic: Google",
  },
  {
    id: 24,
    orderNumber: "#24",
    purchaseId: "W120761L1",
    customerName: "Ravi Nair",
    date: "2026-07-12",
    status: "Shipped",
    total: 3599.0,
    shipmentTracking: "TRK999888777",
    origin: "Organic: Instagram",
  },
];

const getStatusColor = (status) => {
  const colors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Completed: "bg-green-100 text-green-800",
    Failed: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export default function OrdersList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState("all");
  const [bulkOperationsOpen, setBulkOperationsOpen] = useState(false);

  const isInitialLoading = loading && MOCK_ORDERS.length === 0;

  // Calculate status counts
  const statusCounts = {
    all: MOCK_ORDERS.length,
    Processing: MOCK_ORDERS.filter((o) => o.status === "Processing").length,
    "On hold": MOCK_ORDERS.filter((o) => o.status === "On hold").length,
    Shipped: MOCK_ORDERS.filter((o) => o.status === "Shipped").length,
    Cancelled: MOCK_ORDERS.filter((o) => o.status === "Cancelled").length,
    Failed: MOCK_ORDERS.filter((o) => o.status === "Failed").length,
    "Delivery by 10-Days": MOCK_ORDERS.filter(
      (o) => o.status === "Delivery by 10-Days"
    ).length,
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
      const exportData = filteredOrders.map((order, index) => ({
        "Order ID": order.orderNumber,
        "Customer Name": order.customerName,
        Date: formatDate(order.date),
        Status: order.status,
        Total: `₹${order.total.toFixed(2)}`,
        "Shipment Tracking": order.shipmentTracking,
        Origin: order.origin,
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

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || order.status === filters.status;

    const matchesDate =
      !filters.date ||
      (() => {
        const orderDate = new Date(order.date);
        const [year, month] = filters.date.split("-");
        return (
          orderDate.getFullYear() === parseInt(year) &&
          orderDate.getMonth() === parseInt(month) - 1
        );
      })();

    const matchesShippingProvider =
      !filters.shippingProvider ||
      order.shippingProvider === filters.shippingProvider;

    return (
      matchesSearch && matchesStatus && matchesDate && matchesShippingProvider
    );
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      {isInitialLoading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <>
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
              "Processing",
              "On hold",
              "Shipped",
              "Cancelled",
              "Failed",
              "Delivery by 10-Days",
            ].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setActiveStatusFilter(status);
                  setFilters({ status });
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                  activeStatusFilter === status
                    ? "text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeStatusFilter === status
                    ? { backgroundColor: "var(--primary)" }
                    : {}
                }
              >
                {status}{" "}
                <span className="font-semibold">({statusCounts[status]})</span>
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
              orders={MOCK_ORDERS}
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
                  {filteredOrders.length > 0
                    ? `${startIndex + 1}-${Math.min(
                        startIndex + ITEMS_PER_PAGE,
                        filteredOrders.length
                      )} of ${filteredOrders.length}`
                    : "No orders"}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MdChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage >= totalPages}
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
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-8 text-center text-gray-600"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
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
                            {order.orderNumber}
                          </p>
                          <MdVisibility
                            size={14}
                            className="text-blue-400 cursor-pointer hover:text-blue-600 flex-shrink-0"
                            onClick={() => setSelectedOrder(order)}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {order.customerName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {order.purchaseId}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(order.date)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.total)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {order.shipmentTracking}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{order.origin}</p>
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
