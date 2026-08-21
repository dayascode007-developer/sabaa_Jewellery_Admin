"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit, MdDelete, MdCloudUpload } from "react-icons/md";
import BannerModal from "./BannerModal";
import SuccessModal from "@/components/modals/SuccessModal";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { fetchBanners, deleteBanner } from "@/store/slices/bannersSlice";

export default function BannerList() {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);
  const { token } = useSelector((state) => state.adminAuth);

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchBanners({ token }));
    }
  }, [dispatch, token]);

  const handleAddBanner = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setShowModal(true);
  };

  const handleDeleteConfirm = (id) => {
    if (token) {
      dispatch(deleteBanner({ token, bannerId: id }));
      setDeleteConfirm(null);
      setShowDeleteSuccess(true);
    }
  };

  const handleSaveBanner = () => {
    setShowModal(false);
    setShowUploadSuccess(true);
    if (token) {
      dispatch(fetchBanners({ token }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
        <button
          onClick={handleAddBanner}
          style={{ backgroundColor: "var(--primary)" }}
          className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <MdCloudUpload size={20} />
          Upload Banner
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-200 overflow-hidden group">
                <img
                  src={banner.image_url}
                  alt={`Banner ${banner.id}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <MdEdit size={18} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(banner.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <MdDelete size={18} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <MdCloudUpload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 mb-4">
            No banners yet. Create your first one!
          </p>
          <button
            onClick={handleAddBanner}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            Upload Banner
          </button>
        </div>
      )}

      {/* Banner Modal */}
      {showModal && (
        <BannerModal
          banner={editingBanner}
          onSave={handleSaveBanner}
          onClose={() => {
            setShowModal(false);
            setEditingBanner(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        >
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Banner?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this banner? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modals */}
      <SuccessModal
        isOpen={showUploadSuccess}
        onClose={() => setShowUploadSuccess(false)}
        title={
          editingBanner
            ? "Banner Updated Successfully"
            : "Banner Uploaded Successfully"
        }
        message={
          editingBanner
            ? "Your banner has been updated."
            : "Your banner has been uploaded and is now live."
        }
        buttonText="Done"
      />

      <SuccessModal
        isOpen={showDeleteSuccess}
        onClose={() => setShowDeleteSuccess(false)}
        title="Banner Deleted Successfully"
        message="The banner has been removed."
        buttonText="Done"
      />
    </div>
  );
}
