"use client";

import { useState, useRef } from "react";
import { MdClose, MdFileDownload, MdEdit } from "react-icons/md";
import { PiMicrosoftExcelLogoLight } from "react-icons/pi";

export default function BulkOperationsModal({
  isOpen,
  onClose,
  onExport,
  onUpdate,
  isExporting = false,
  selectedCount = 0,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    await onExport();
    onClose();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      setSelectedFile(file);
    }
  };

  const handleUpdate = () => {
    if (selectedFile) {
      onUpdate(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PiMicrosoftExcelLogoLight size={28} className="text-gray-900" />

            <h2 className="text-lg font-semibold text-gray-900">
              Bulk Operations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <MdClose size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Download order data as Excel file.
          </p>
          {selectedCount > 0 && (
            <p className="text-sm text-blue-600 font-medium mt-2">
              📋 {selectedCount} order(s) selected - will export only these
            </p>
          )}
          {selectedCount === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No selection - will export all filtered records
            </p>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* File Browse Area */}
        <div
          onClick={handleFileClick}
          className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900 mb-2">
            {selectedFile
              ? `Selected: ${selectedFile.name}`
              : "Excel file columns"}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            <span className="text-blue-600 font-medium">Click to browse</span>
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: .xlsx, .xls
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-300 font-medium transition-all ${
              isExporting
                ? "text-gray-400 opacity-50 cursor-not-allowed"
                : "text-gray-900 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <MdFileDownload size={18} />
                <span>Export</span>
              </>
            )}
          </button>
          <button
            onClick={handleUpdate}
            disabled={!selectedFile}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-white font-medium transition-all cursor-pointer ${
              selectedFile
                ? "hover:opacity-90"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{ backgroundColor: "var(--primary)" }}
          >
            <MdEdit size={18} />
            <span>Update</span>
          </button>
        </div>
      </div>
    </div>
  );
}
