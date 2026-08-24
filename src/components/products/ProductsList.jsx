"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete } from "react-icons/md";
import Link from "next/link";
import {
  fetchProducts,
  deleteProduct,
} from "@/store/slices/productsSlice";
import DeleteConfirmModal from "./DeleteConfirmModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function ProductsList() {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedProductName, setDeletedProductName] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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
    dispatch(fetchProducts());
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  return (
    <>
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
            <Link
              href="/products/add"
              style={{ backgroundColor: "var(--primary)" }}
              className="px-4 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              + Add Product
            </Link>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-600">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
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
                        <p className={`text-sm font-semibold ${product.sale_price ? "text-red-600" : "text-gray-600"}`}>
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
                        {product.stock_status === "in-stock" ? "In stock" : "Out of stock"} ({product.quantity})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(product.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
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
