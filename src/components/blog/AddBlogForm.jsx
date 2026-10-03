"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MdClose, MdCloudUpload, MdDelete } from "react-icons/md";
import { TiArrowLeftThick } from "react-icons/ti";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SuccessModal from "@/components/modals/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal";
import { createBlog, updateBlog } from "@/store/slices/blogsSlice";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

export default function AddBlogForm({ initialBlog = null }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.blogs);
  const isEditing = !!initialBlog;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    title: initialBlog?.title || "",
    description: initialBlog?.description || "",
    publishedDate: initialBlog?.publishedDate
      ? new Date(initialBlog.publishedDate)
      : new Date(),
  });

  const [mainImage, setMainImage] = useState(
    initialBlog?.main_image || initialBlog?.mainImage || null
  );
  const [contentSections, setContentSections] = useState(
    initialBlog?.content || [{ id: 1, heading: "", text: "", image: null }]
  );
  const [nextSectionId, setNextSectionId] = useState(
    initialBlog?.content?.length
      ? Math.max(...initialBlog.content.map((c) => c.id)) + 1
      : 2
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    if ((name === "title" || name === "description") && value) {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      if (fieldErrors.mainImage) {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated.mainImage;
          return updated;
        });
      }
    }
  };

  const handleAddSection = () => {
    setContentSections((prev) => [
      ...prev,
      { id: nextSectionId, heading: "", text: "", image: null },
    ]);
    setNextSectionId((prev) => prev + 1);
  };

  const handleRemoveSection = (id) => {
    setContentSections((prev) => prev.filter((section) => section.id !== id));
  };

  const handleSectionChange = (id, field, value) => {
    let processedValue = value;

    if (field === "heading" && value) {
      processedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setContentSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: processedValue } : section
      )
    );
    if (fieldErrors.content) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated.content;
        return updated;
      });
    }
  };

  const handleSectionImageUpload = (e, id) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSectionChange(id, "image", file);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.push("/blog");
  };
  //USBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Blog title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    if (!mainImage) {
      errors.mainImage = "Main image is required";
    }
    if (!formData.publishedDate) {
      errors.publishedDate = "Published date is required";
    }
    if (contentSections.length === 0) {
      errors.content = "At least one content section is required";
    } else {
      for (let section of contentSections) {
        if (!section.heading.trim()) {
          errors.content = "All sections must have a heading";
          break;
        }
        const plainText = section.text.replace(/<[^>]*>/g, "").trim();
        if (!plainText) {
          errors.content = "All sections must have content text";
          break;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const errMsg =
        Object.values(errors).find((e) => e) ||
        "Please fill in all required fields";
      setErrorMessage(errMsg);
      setShowErrorModal(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    const publishedDateStr =
      formData.publishedDate instanceof Date
        ? formData.publishedDate.toISOString().split("T")[0]
        : formData.publishedDate;

    const formDataWithFiles = new FormData();
    formDataWithFiles.append("title", formData.title);
    formDataWithFiles.append("description", formData.description);
    formDataWithFiles.append("publishedDate", publishedDateStr);
    formDataWithFiles.append("content", JSON.stringify(contentSections));

    if (mainImage instanceof File) {
      formDataWithFiles.append("mainImage", mainImage);
    } else if (mainImage && !isEditing) {
      formDataWithFiles.append("mainImage", mainImage);
    }

    contentSections.forEach((section, index) => {
      if (section.image instanceof File) {
        formDataWithFiles.append(`sectionImage_${index}`, section.image);
      }
    });

    try {
      if (isEditing) {
        await dispatch(
          updateBlog({ id: initialBlog.id, formData: formDataWithFiles })
        ).unwrap();
      } else {
        await dispatch(createBlog(formDataWithFiles)).unwrap();
      }
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(error || "Failed to save blog");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="space-y-4">
        <button
          onClick={() => router.push("/blog")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <TiArrowLeftThick size={24} />
          <span>Back</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Blog" : "Add New Blog"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update your blog post"
              : "Create and publish a new blog post"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>

          {/* Blog Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter blog title"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                fieldErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
            {fieldErrors.title && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Blog introduction/description"
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                fieldErrors.description ? "border-red-500" : "border-gray-300"
              }`}
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Main Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                fieldErrors.mainImage ? "border-red-500" : "border-gray-300"
              }`}
            >
              {mainImage ? (
                <div className="relative inline-block">
                  <img
                    src={
                      mainImage instanceof File
                        ? URL.createObjectURL(mainImage)
                        : mainImage
                    }
                    alt="Main"
                    className="h-40 w-full object-cover rounded-lg max-w-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ) : (
                <div>
                  <MdCloudUpload
                    size={32}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <label className="cursor-pointer">
                    <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            {fieldErrors.mainImage && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.mainImage}
              </p>
            )}
          </div>

          {/* Published Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Published Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={formData.publishedDate}
              onChange={(date) =>
                setFormData({ ...formData, publishedDate: date })
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black ${
                fieldErrors.publishedDate ? "border-red-500" : "border-gray-300"
              }`}
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
            {fieldErrors.publishedDate && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.publishedDate}
              </p>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Blog Content</h2>
          {contentSections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Section {index + 1}
                </h3>
                {contentSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(section.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    <MdDelete size={18} />
                  </button>
                )}
              </div>

              {/* Section Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Section Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={section.heading}
                  onChange={(e) =>
                    handleSectionChange(section.id, "heading", e.target.value)
                  }
                  placeholder="e.g., The Legacy of Panchalogam"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Section Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content Text <span className="text-red-500">*</span>
                </label>
                <Editor
                  value={section.text}
                  onEditorChange={(val) =>
                    handleSectionChange(section.id, "text", val || "")
                  }
                  init={{
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image table media | code fullscreen help",
                    height: 400,
                    menubar: "edit view insert format tools",
                    branding: false,
                  }}
                  tinymceScriptSrc={process.env.NEXT_PUBLIC_TINYMCE_SCRIPT_SRC}
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                />
              </div>

              {/* Section Image */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Section Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {section.image ? (
                    <div className="relative inline-block">
                      <img
                        src={
                          section.image instanceof File
                            ? URL.createObjectURL(section.image)
                            : section.image
                        }
                        alt="Section"
                        className="h-32 w-48 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleSectionChange(section.id, "image", null)
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <MdCloudUpload
                        size={24}
                        className="mx-auto text-gray-400 mb-1"
                      />
                      <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Upload image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSectionImageUpload(e, section.id)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Section Button */}
          <button
            type="button"
            onClick={handleAddSection}
            style={{ backgroundColor: "var(--primary)" }}
            className="w-auto px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            + Add Content Section
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            type="submit"
            style={{ backgroundColor: "var(--primary)" }}
            className="px-8 py-2.5 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            {isEditing ? "Update Blog" : "Publish Blog"}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title={
          isEditing
            ? "Blog Updated Successfully"
            : "Blog Published Successfully"
        }
        message={
          isEditing
            ? "Your blog post has been updated."
            : "Your blog post has been published and is now live."
        }
        buttonText="View Blog"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage("");
        }}
        title="Error"
        message={errorMessage}
        buttonText="Try Again"
      />
    </div>
  );
}
