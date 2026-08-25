"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete, MdChevronLeft, MdChevronRight } from "react-icons/md";

import Link from "next/link";
import { fetchProducts, deleteProduct } from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import AdvancedSearchFilter from "./AdvancedSearchFilter";

import SkeletonLoader from "@/components/common/SkeletonLoader";

const ITEMS_PER_PAGE = 10;

export default function ProductsList() {
  const dispatch = useDispatch();
  const { products, loading, total } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedProductName, setDeletedProductName] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    stockStatus: "",
    startDate: "",
    endDate: "",
  });

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  // Fetch products with filters and pagination
  useEffect(() => {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(fetchProducts({ limit: ITEMS_PER_PAGE, offset, filters }));
  }, [dispatch, currentPage, filters]);

  const handleEditClick = (product) => {
    // Store product data for edit mode
    sessionStorage.setItem(
      "editProductData",
      JSON.stringify({
        product,
        isEdit: true,
      })
    );
    window.location.href = "/products/add";
  };

  const handleDeleteClick = (product) => {
    setSelectedProductForDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductForDelete) {
      setDeletedProductName(selectedProductForDelete.title);
      dispatch(deleteProduct(selectedProductForDelete.id)).then((result) => {
        if (result.type === deleteProduct.fulfilled.type) {
          setShowDeleteModal(false);
          setShowSuccessModal(true);
        }
      });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedProductForDelete(null);
    // Refetch with pagination parameters
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    dispatch(fetchProducts({ limit: ITEMS_PER_PAGE, offset }));
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  return (
    <>
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <>
          {/* Advanced Search Filter */}
          <AdvancedSearchFilter
            onFilterChange={setFilters}
            categories={categories}
          />

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Add Button and Pagination */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Products
            </h2>

            <div className="flex items-center gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                {total > 0
                  ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, total)} of ${total}`
                  : "No products"}
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

              {/* Add Product Button */}
              <Link
                href="/products/add"
                style={{ backgroundColor: "var(--primary)" }}
                className="px-5 py-2.5 text-white font-medium rounded-full hover:opacity-90 active:opacity-80 transition-all whitespace-nowrap shadow-sm cursor-pointer"
              >
                + Add Product
              </Link>
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
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Regular Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Sale Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Stock
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
              {!Array.isArray(products) || products.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-600"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 w-12">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.main_image && (
                          <img
                            src={product.main_image}
                            alt={product.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <p className="text-sm font-medium text-gray-900">
                          {product.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {product.sku || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {product.category_name || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {formatPrice(product.regular_price)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {product.sale_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.regular_price)}
                          </p>
                        )}
                        <p
                          className={`text-sm font-semibold ${
                            product.sale_price
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {product.sale_price
                            ? formatPrice(product.sale_price)
                            : "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.quantity > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.stock_status === "in-stock"
                          ? "In stock"
                          : "Out of stock"}{" "}
                        ({product.quantity})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(product.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
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
                ))
              )}
            </tbody>
          </table>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={selectedProductForDelete?.title}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Product Deleted Successfully"
        message={`${deletedProductName} has been removed from products.`}
        buttonText="Done"
      />
    </>
  );
}
