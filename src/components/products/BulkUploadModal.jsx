"use client";

import { useState } from "react";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";

export default function BulkUploadModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (isValid) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid Excel file (.xlsx, .xls, .csv)");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    console.log("Uploading file:", selectedFile);
    // TODO: Implement file upload logic
    onClose();
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PiMicrosoftExcelLogoThin
              size={28}
              style={{ color: "var(--primary)" }}
            />
            <h2 className="text-2xl font-semibold text-gray-900">
              Bulk Upload Products
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Info */}
        <p className="text-gray-600 mb-6">
          Upload an Excel file (.xlsx, .xls, .csv) with product information.
          Maximum file size: 5MB
        </p>

        {/* File Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          {selectedFile ? (
            <div className="space-y-4">
              <PiMicrosoftExcelLogoThin
                size={48}
                style={{ color: "var(--primary)" }}
                className="mx-auto"
              />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Choose different file
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <MdCloudUpload size={48} className="mx-auto text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Drag and drop your file here
                </p>
                <p className="text-sm text-gray-600">or</p>
              </div>
              <label className="inline-block">
                <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  Click to browse
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Required columns:</strong> Product Title, Regular Price,
            Sale Price, Category, etc.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Download a sample template to see the required format.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 hover:shadow-md hover:scale-105 transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <PiMicrosoftExcelLogoThin size={18} />
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
