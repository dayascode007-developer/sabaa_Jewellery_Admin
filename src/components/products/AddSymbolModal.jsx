"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { uploadSymbol, clearUploadError } from "@/store/slices/symbolsSlice";

export default function AddSymbolModal({ isOpen, onClose, onSymbolAdded }) {
  const dispatch = useDispatch();
  const { uploading, uploadError } = useSelector((state) => state.symbols);
  const [symbolName, setSymbolName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/webp") {
      setError("Only WebP format allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleUpload = async () => {
    if (!symbolName.trim()) {
      setError("Symbol name is required");
      return;
    }

    if (!selectedFile) {
      setError("Please select a WebP file");
      return;
    }

    setError("");
    setSuccess("");

    const result = await dispatch(
      uploadSymbol({ symbolName, file: selectedFile })
    );

    if (result.type === uploadSymbol.fulfilled.type) {
      setSuccess("Symbol uploaded successfully!");
      setTimeout(() => {
        setSymbolName("");
        setSelectedFile(null);
        setPreview(null);
        onSymbolAdded();
        onClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setSymbolName("");
    setSelectedFile(null);
    setPreview(null);
    setError("");
    setSuccess("");
    dispatch(clearUploadError());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Symbol</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Symbol Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Symbol Name *
            </label>
            <input
              type="text"
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
              placeholder="e.g., Star, Heart, Om"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              WebP Image *
            </label>
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <>
                  <MdCloudUpload size={32} className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload WebP
                  </span>
                </>
              )}
              <input
                type="file"
                accept=".webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-2">{selectedFile.name}</p>
            )}
          </div>

          {/* Error Message */}
          {(error || uploadError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error || uploadError}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
              {success}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
