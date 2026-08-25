"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdCloudUpload, MdCheckCircle, MdError } from "react-icons/md";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import { confirmBulkUpload, downloadTemplate } from "@/store/slices/bulkProductsSlice";
import SuccessModal from "@/components/modals/SuccessModal";

export default function BulkUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const dispatch = useDispatch();
  const { validationResults, loading, error } = useSelector((state) => state.bulkProducts);
  const [step, setStep] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = [".xlsx", ".xls"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (isValid && file.size <= 10 * 1024 * 1024) {
      setSelectedFile(file);
      setFileError(null);
    } else if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be less than 10MB");
    } else {
      setFileError("Please upload a valid Excel file (.xlsx, .xls)");
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

  const handleDownloadTemplate = async () => {
    await dispatch(downloadTemplate());
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setFileError("Please select a file first");
      return;
    }

    setFileError(null); // Clear previous errors
    const result = await dispatch(confirmBulkUpload(selectedFile));
    if (result.type === confirmBulkUpload.fulfilled.type) {
      // Check if upload was successful (at least some products created)
      if (result.payload?.created > 0) {
        setShowSuccessModal(true);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
      // If only failures, stay on upload step to show errors
    }
    // If rejected, error is in Redux state and will display automatically
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    handleClose();
  };

  const handleClose = () => {
    setStep("upload");
    setSelectedFile(null);
    setFileError(null);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <PiMicrosoftExcelLogoThin size={28} style={{ color: "var(--primary)" }} />
            <h2 className="text-2xl font-semibold text-gray-900">Bulk Upload Products</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Upload Step */}
        {step === "upload" && (
          <>
            <p className="text-gray-600 mb-6">
              Upload an Excel file with product information. All products include images using Excel's built-in image feature.
              Maximum file size: 10MB
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
                    <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
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
                    <p className="text-lg font-semibold text-gray-900">Drag and drop your file here</p>
                    <p className="text-sm text-gray-600">or</p>
                  </div>
                  <label className="inline-block">
                    <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                      Click to browse
                    </span>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500">Supported formats: .xlsx, .xls</p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>First time uploading?</strong> Download our template to see the required format with all fields.
              </p>
              <p className="text-xs text-gray-600 mt-2">
                The template includes instructions for image insertion using Excel's built-in image feature.
              </p>
            </div>

            {(fileError || error || validationResults?.confirmResult?.failed > 0) && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex gap-3 mb-3">
                  <MdError className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-red-800 font-semibold">{fileError || error || "Some products failed to create"}</p>
                </div>
                {validationResults?.confirmResult?.failedDetails && validationResults.confirmResult.failedDetails.length > 0 && (
                  <div className="ml-8 space-y-2 max-h-40 overflow-y-auto">
                    <p className="text-sm text-red-700 font-medium">Failed Products:</p>
                    {validationResults.confirmResult.failedDetails.map((failed, idx) => (
                      <div key={idx} className="text-sm text-red-700 p-3 bg-white rounded border border-red-100">
                        <strong>{failed.sku || failed.title}:</strong> {failed.error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Download Template
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
                style={{ backgroundColor: "var(--primary)" }}
                className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </>
        )}

        {/* Completed Step */}
        {step === "completed" && (
          <>
            <div className="text-center py-8">
              <MdCheckCircle size={64} className="mx-auto text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-600 mb-6">
                {validationResults?.confirmResult?.created} products have been created successfully.
              </p>

              {validationResults?.confirmResult?.failed > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-left mb-6">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">
                    {validationResults.confirmResult.failed} products failed to create:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {validationResults.confirmResult.failedDetails?.map((failed, idx) => (
                      <p key={idx} className="text-xs text-yellow-700">
                        <strong>{failed.sku}:</strong> {failed.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={handleClose}
                style={{ backgroundColor: "var(--primary)" }}
                className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg transition-all"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessClose}
          title="Bulk Upload Complete! ✨"
          message={`${validationResults?.confirmResult?.created || 0} product${validationResults?.confirmResult?.created !== 1 ? 's' : ''} have been added to your store successfully.${
            validationResults?.confirmResult?.failed > 0
              ? ` (${validationResults.confirmResult.failed} product${validationResults.confirmResult.failed !== 1 ? 's' : ''} failed)`
              : ""
          }`}
          buttonText="Done"
        />
      )}
    </>
  );
}
