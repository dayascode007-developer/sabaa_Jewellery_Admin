"use client";

import { useState, useEffect } from "react";
import { MdClose, MdCloudUpload } from "react-icons/md";

export default function BannerModal({ banner, onSave, onClose }) {
  const [bannerImage, setBannerImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (banner) {
      setBannerImage(banner.image);
    }
  }, [banner]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImage(reader.result);
        if (fieldErrors.image) {
          setFieldErrors((prev) => {
            const updated = { ...prev };
            delete updated.image;
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!bannerImage) {
      errors.image = "Banner image is required";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    onSave({
      title: banner?.title || "Banner",
      description: banner?.description || "",
      position: banner?.position || 1,
      isActive: banner?.isActive !== false,
      image: bannerImage,
    });
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {banner ? "Edit Banner" : "Upload New Banner"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Image */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Banner Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                fieldErrors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              {bannerImage ? (
                <div className="relative inline-block">
                  <img
                    src={bannerImage}
                    alt="Banner Preview"
                    className="h-40 w-full object-cover rounded-lg max-w-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setBannerImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <MdCloudUpload size={32} className="mx-auto text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Click to upload image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x400px
                  </p>
                </div>
              )}
            </div>
            {fieldErrors.image && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.image}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              {banner ? "Update Banner" : "Upload Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
