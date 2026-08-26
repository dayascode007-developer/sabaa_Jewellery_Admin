"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryTable from "@/components/inventory/InventoryTable";
import {
  fetchInventoryStats,
  fetchInventory,
} from "@/store/slices/inventorySlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";

export default function Inventory() {
  const dispatch = useDispatch();
  const { stats, items, pagination, loading, initialLoad } = useSelector(
    (state) => state.inventory
  );
  const { categories } = useSelector((state) => state.categories);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInventoryStats());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchInventory({
        page: currentPage,
        limit: 10,
        search,
        category,
        status,
      })
    );
  }, [dispatch, currentPage, search, category, status]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600 mt-1">
          Manage product stock levels and inventory alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4"
          style={{ borderLeftColor: "var(--primary)" }}
        >
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalProducts || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Out of stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats.criticalStock || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.lowStock || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">In Stock</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.inStock || 0}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
          </div>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
          >
            <option value="all">All Categories</option>
            {categories && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
          <select
            value={status}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
          >
            <option value="all">All Status</option>
            <option value="out-of-stock">Out of stock</option>
            <option value="low">Low</option>
            <option value="in-stock">In stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable
        inventoryItems={items}
        loading={loading && initialLoad}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
