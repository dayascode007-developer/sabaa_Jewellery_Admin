"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdFilterList, MdEdit, MdDelete } from "react-icons/md";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";

export default function ProductsTable({ products }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    productType: "all",
    stockStatus: "all",
  });
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedProductName, setDeletedProductName] = useState("");
  const itemsPerPage = 10;

  const handleEditClick = (product) => {
    const productData = {
      formData: {
        title: product.name,
        description: product.description || "",
        regularPrice: product.originalPrice ? product.originalPrice.replace(/₹|,/g, "") : "",
        salePrice: product.price ? product.price.replace(/₹|,/g, "") : "",
        sku: product.sku,
        category: product.category,
        quantity: product.stock || 0,
        minStock: 0,
        trackStock: true,
        stockStatus: "in-stock",
        allowBackorders: "not-allow",
        limitPurchases: false,
        enableReviews: true,
        weight: "",
        length: "",
        width: "",
        height: "",
        size: "",
        font: "",
        color: "",
        symbol: "",
        symbolDirection: "",
      },
      mainImage: null,
      subImageSlots: [{ id: 1, image: null }],
      ringSizes: [{ id: 1, size: "" }],
      detailsSections: {
        productDetails: [{ id: 1, content: "" }],
        cleaningPolishing: [{ id: 1, content: "" }],
        usageColorGuarantee: [{ id: 1, content: "" }],
        returnExchangePolicy: [{ id: 1, content: "" }],
        addressContact: [{ id: 1, content: "" }],
      },
    };

    sessionStorage.setItem("editProductData", JSON.stringify(productData));
    router.push(`/products/${product.id}/edit`);
  };

  const handleDeleteClick = (product) => {
    setSelectedProductForDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setDeletedProductName(selectedProductForDelete?.name);
    setShowDeleteModal(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedProductForDelete(null);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;

      const matchesStockStatus =
        filters.stockStatus === "all" || product.status === filters.stockStatus;

      return matchesSearch && matchesCategory && matchesStockStatus;
    });

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        return parseFloat(a.price.replace(/₹|,/g, "")) -
               parseFloat(b.price.replace(/₹|,/g, ""));
      } else if (sortBy === "stock") {
        return a.stock - b.stock;
      } else {
        return new Date(b.date) - new Date(a.date);
      }
    });

    return result;
  }, [products, searchTerm, filters, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const categories = ["all", ...new Set(products.map((p) => p.category))];
  const stockStatuses = ["all", ...new Set(products.map((p) => p.status))];

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdFilterList size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "Select a category" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <select
              value={filters.stockStatus}
              onChange={(e) =>
                setFilters({ ...filters, stockStatus: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            >
              {stockStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            >
              <option value="date">Date (Newest)</option>
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low to High)</option>
              <option value="stock">Stock (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
            style={{ "--tw-ring-color": "var(--primary)" }}
          />
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
          {filteredProducts.length} items
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 text-black"
          >
            ←
          </button>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = Math.min(Math.max(1, parseInt(e.target.value)), totalPages);
              setCurrentPage(page);
            }}
            className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm text-black"
          />
          <span className="text-sm text-gray-600">of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 text-black"
          >
            →
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
                    {product.name}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{product.sku}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
                    In stock ({product.stock})
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 line-through">
                      {product.originalPrice}
                    </p>
                    <p className="text-sm font-semibold text-red-600">
                      {product.price}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{product.category_name || "—"}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{product.date}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit product"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProductForDelete?.name}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Product Deleted Successfully"
        message={`${deletedProductName} has been removed from the catalog.`}
        buttonText="Done"
      />
    </div>
  );
}
