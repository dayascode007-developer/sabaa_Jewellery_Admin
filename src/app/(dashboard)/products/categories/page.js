"use client";

import { useState } from "react";
import CategoriesTable from "@/components/categories/CategoriesTable";
import SubCategoriesTable from "@/components/categories/SubCategoriesTable";

export default function Categories() {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-1">Manage product categories</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "categories"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "subcategories"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Sub Categories
        </button>
      </div>

      {/* Categories Table */}
      {activeTab === "categories" && <CategoriesTable />}

      {/* Sub Categories Table */}
      {activeTab === "subcategories" && <SubCategoriesTable />}
    </div>
  );
}
