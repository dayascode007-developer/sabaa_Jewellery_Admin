"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdClose, MdCloudUpload } from "react-icons/md";
import {
  FaStar,
  FaHeart,
  FaLeaf,
  FaMoon,
  FaCircle,
  FaSun,
} from "react-icons/fa";
import { MdLocalFlorist, MdDiamond } from "react-icons/md";
import { GrFormNextLink } from "react-icons/gr";
import SuccessModal from "@/components/modals/SuccessModal";

export default function AddProductForm({ productId = null }) {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const fontOptions = [
    { name: "Arial", cssFamily: "Arial, sans-serif" },
    { name: "Serif", cssFamily: "serif" },
    { name: "Sans-serif", cssFamily: "sans-serif" },
    { name: "Monospace", cssFamily: "monospace" },
    { name: "Georgia", cssFamily: "Georgia, serif" },
    { name: "Trebuchet MS", cssFamily: "Trebuchet MS, sans-serif" },
  ];
  const colorOptions = [
    { name: "Gold", hex: "#FFD700" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Yellow Gold", hex: "#FFC700" },
    { name: "Platinum", hex: "#E8E8E8" },
  ];
  const symbolOptions = [
    { name: "Star", iconName: "FaStar", icon: FaStar },
    { name: "Heart", iconName: "FaHeart", icon: FaHeart },
    { name: "Om", iconName: "Om", text: "ॐ" },
    { name: "Flower", iconName: "MdLocalFlorist", icon: MdLocalFlorist },
    { name: "Leaf", iconName: "FaLeaf", icon: FaLeaf },
    { name: "Moon", iconName: "FaMoon", icon: FaMoon },
    { name: "Sun", iconName: "FaSun", icon: FaSun },
    { name: "Diamond", iconName: "MdDiamond", icon: MdDiamond },
    { name: "Circle", iconName: "FaCircle", icon: FaCircle },
  ];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    sku: "",
    category: "",
    quantity: 0,
    minStock: 0,
    trackStock: false,
    stockStatus: "in-stock",
    allowBackorders: "not-allow",
    limitPurchases: false,
    enableReviews: true,
    weight: "",
    length: "",
    width: "",
    height: "",
    size: "",
    font: [],
    color: [],
    symbol: [],
    symbolDirection: "",
    productDetails: "",
    cleaningPolishing: "",
    usageColorGuarantee: "",
    returnExchangePolicy: "",
    addressContact: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [subImageSlots, setSubImageSlots] = useState([{ id: 1, image: null }]);
  const [nextSlotId, setNextSlotId] = useState(2);
  const [ringSizes, setRingSizes] = useState([{ id: 1, size: "" }]);
  const [nextSizeId, setNextSizeId] = useState(2);
  const [detailsSections, setDetailsSections] = useState({
    productDetails: [
      { id: 1, content: "Made in Genuine Panchalogam (5 Metal imbon)" },
      { id: 2, content: "Daily and regular usage will helps maintain color." },
      { id: 3, content: "Handmade ring with workmanship" },
      { id: 4, content: "Both - male, female" },
    ],
    cleaningPolishing: [
      { id: 1, content: "Use viboothi powder with water drops to clean ring" },
    ],
    usageColorGuarantee: [
      {
        id: 1,
        content:
          "Strictly use viboothy powder with water repeatedly for 5 minutes",
      },
      { id: 2, content: "Occasional usage will reduce ring polish" },
    ],
    returnExchangePolicy: [
      {
        id: 1,
        content:
          "Our return and exchange policy allows returns within 30 days of purchase for unused items.",
      },
      { id: 2, content: "Please contact us for exchange requests." },
    ],
    addressContact: [
      { id: 1, content: "Our Store located in Tamilnadu & Kerala" },
      {
        id: 2,
        content:
          "Head Office: Sabaa Jewel arts, 54, Gandhi nagar, vilvanagar, semmandalam, cuddalore 607001",
      },
      { id: 3, content: "Contact Mobile: +91 7871900140" },
    ],
  });
  const [nextDetailId, setNextDetailId] = useState({
    productDetails: 5,
    cleaningPolishing: 2,
    usageColorGuarantee: 3,
    returnExchangePolicy: 3,
    addressContact: 4,
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("editProductData");
    if (storedData) {
      try {
        const decoded = JSON.parse(storedData);
        setIsEditMode(true);
        const loadedFormData = decoded.formData || formData;
        setFormData({
          ...loadedFormData,
          font: Array.isArray(loadedFormData.font) ? loadedFormData.font : [],
          color: Array.isArray(loadedFormData.color) ? loadedFormData.color : [],
          symbol: Array.isArray(loadedFormData.symbol) ? loadedFormData.symbol : [],
        });
        setMainImage(decoded.mainImage || null);
        setSubImageSlots(decoded.subImageSlots || [{ id: 1, image: null }]);
        setRingSizes(decoded.ringSizes || [{ id: 1, size: "" }]);
        setDetailsSections(decoded.detailsSections || detailsSections);
        sessionStorage.removeItem("editProductData");
        router.replace(window.location.pathname);
      } catch (e) {
        console.error("Failed to load product data:", e);
      }
    }
  }, [router]);

  const tabs = [
    { id: "general", label: "General" },
    { id: "inventory", label: "Inventory" },
    { id: "shipping", label: "Shipping" },
    { id: "attributes", label: "Attributes" },
    { id: "details", label: "Details" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTitleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9\s\-]/g, "");
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFormData((prev) => ({ ...prev, title: value }));
  };

  const handleCheckboxChange = (fieldName, option) => {
    setFormData((prev) => {
      const currentArray = prev[fieldName] || [];

      // Check if option is already selected (for objects with name property)
      const isSelected = currentArray.some((item) => {
        if (typeof item === "object" && typeof option === "object") {
          return item.name === option.name;
        }
        return item === option;
      });

      // Add or remove option
      const updatedArray = isSelected
        ? currentArray.filter((item) => {
            if (typeof item === "object" && typeof option === "object") {
              return item.name !== option.name;
            }
            return item !== option;
          })
        : [...currentArray, option];

      return {
        ...prev,
        [fieldName]: updatedArray,
      };
    });
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImageUpload = (e, slotId) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImageSlots((prev) =>
          prev.map((slot) =>
            slot.id === slotId ? { ...slot, image: reader.result } : slot
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSubImageSlot = (slotId) => {
    setSubImageSlots((prev) => prev.filter((slot) => slot.id !== slotId));
  };

  const addSubImageSlot = () => {
    setSubImageSlots((prev) => [...prev, { id: nextSlotId, image: null }]);
    setNextSlotId((prev) => prev + 1);
  };

  const removeRingSizeSlot = (slotId) => {
    setRingSizes((prev) => prev.filter((slot) => slot.id !== slotId));
  };

  const addRingSizeSlot = (inputValue = "") => {
    if (inputValue) {
      setRingSizes((prev) => [...prev, { id: nextSizeId, size: inputValue }]);
      setNextSizeId((prev) => prev + 1);
    }
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
    }
    const tabOrder = [
      "general",
      "inventory",
      "shipping",
      "attributes",
      "details",
    ];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabOrder = [
      "general",
      "inventory",
      "shipping",
      "attributes",
      "details",
    ];
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const prepareDataForStorage = () => {
    // Convert objects to storable format (removing icon components)
    return {
      ...formData,
      font: formData.font.map((f) =>
        typeof f === "object" ? { name: f.name, cssFamily: f.cssFamily } : f
      ),
      color: formData.color.map((c) =>
        typeof c === "object" ? { name: c.name, hex: c.hex } : c
      ),
      symbol: formData.symbol.map((s) =>
        typeof s === "object" ? { name: s.name, iconName: s.iconName } : s
      ),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only show success modal when actually submitting (on details tab)
    if (activeTab === "details") {
      const storageData = prepareDataForStorage();
      console.log("Data to store in DB:", storageData);
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (isEditMode) {
      router.push("/products");
    } else {
      router.push("/products");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Product" : "Add Product"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Update product details"
            : "Create a new product with images and details"}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {isEditMode && (
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter product title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Regular Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Sale Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="rings">Rings</option>
                  <option value="earrings">Earrings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="anklets">Anklets</option>
                  <option value="chains">Chains</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tax status <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  >
                    <option value="taxable">Taxable</option>
                    <option value="shipping">Shipping only</option>
                    <option value="none">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tax class <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                    style={{ "--tw-ring-color": "var(--primary)" }}
                  >
                    <option value="standard">Standard</option>
                    <option value="reduced">Reduced rate</option>
                    <option value="zero">Zero rate</option>
                  </select>
                </div>
              </div>

              {/* Enable Reviews Checkbox */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="enableReviews"
                    checked={formData.enableReviews}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        enableReviews: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Enable reviews
                  </span>
                </label>
              </div>

              {/* Images Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Product Images
                  </h3>
                  <button
                    type="button"
                    onClick={addSubImageSlot}
                    style={{ backgroundColor: "var(--primary)" }}
                    className="px-4 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm shadow-md cursor-pointer"
                  >
                    + Add image
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Main Image Slot */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Main Image <span className="text-red-500">*</span>
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {mainImage ? (
                        <div className="relative inline-block">
                          <img
                            src={mainImage}
                            alt="Main"
                            className="h-32 w-32 object-cover rounded-lg"
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
                  </div>

                  {/* Sub Images Grid */}
                  {subImageSlots.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Sub Images
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {subImageSlots.map((slot) => (
                          <div key={slot.id} className="relative h-24 w-24">
                            {slot.image ? (
                              <img
                                src={slot.image}
                                alt={`Sub ${slot.id}`}
                                className="h-24 w-24 object-cover rounded-lg"
                              />
                            ) : (
                              <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 w-24 flex items-center justify-center cursor-pointer hover:border-gray-400 block">
                                <MdCloudUpload
                                  size={20}
                                  className="text-gray-400"
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleSubImageUpload(e, slot.id)
                                  }
                                  className="hidden"
                                />
                              </label>
                            )}
                            <button
                              type="button"
                              onClick={() => removeSubImageSlot(slot.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <MdClose size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., SKU-001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                  required
                />
              </div>

              {/* Stock Management Section */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="trackStock"
                    checked={formData.trackStock}
                    onChange={(e) =>
                      setFormData({ ...formData, trackStock: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Track stock quantity for this product
                  </span>
                </label>
              </div>

              {/* Stock Status - Always Visible */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Stock status <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="in-stock"
                      checked={formData.stockStatus === "in-stock"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">In stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="out-of-stock"
                      checked={formData.stockStatus === "out-of-stock"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">Out of stock</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="on-backorder"
                      checked={formData.stockStatus === "on-backorder"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">On backorder</span>
                  </label>
                </div>
              </div>

              {/* Show these fields only if trackStock is checked */}
              {formData.trackStock && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                      style={{ "--tw-ring-color": "var(--primary)" }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Allow backorders?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="allowBackorders"
                          value="not-allow"
                          checked={formData.allowBackorders === "not-allow"}
                          onChange={handleInputChange}
                        />
                        <span className="text-sm text-gray-700">
                          Do not allow
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="allowBackorders"
                          value="notify"
                          checked={formData.allowBackorders === "notify"}
                          onChange={handleInputChange}
                        />
                        <span className="text-sm text-gray-700">
                          Allow, but notify customer
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="allowBackorders"
                          value="allow"
                          checked={formData.allowBackorders === "allow"}
                          onChange={handleInputChange}
                        />
                        <span className="text-sm text-gray-700">Allow</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Low stock threshold
                    </label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleInputChange}
                      placeholder="e.g., 5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                  </div>
                </div>
              )}

              {/* Sold Individually - Always Visible */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="limitPurchases"
                    checked={formData.limitPurchases}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        limitPurchases: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Limit purchases to 1 item per order
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Weight (g)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      name="length"
                      value={formData.length}
                      onChange={handleInputChange}
                      placeholder="Length"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      placeholder="Width"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      placeholder="Height"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                      style={{ "--tw-ring-color": "var(--primary)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attributes Tab */}
        {activeTab === "attributes" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ring Size
                </label>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addRingSizeSlot(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                >
                  <option value="">Select a ring size</option>
                  {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    )
                  )}
                </select>
                {ringSizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {ringSizes
                      .filter((sizeSlot) => sizeSlot.size)
                      .map((sizeSlot) => (
                        <span
                          key={sizeSlot.id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded text-sm font-medium text-black"
                        >
                          {sizeSlot.size}
                          <button
                            type="button"
                            onClick={() => removeRingSizeSlot(sizeSlot.id)}
                            className="text-gray-500 hover:text-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Font
                </label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 w-fit">
                  {fontOptions.map((option) => (
                    <label
                      key={option.name}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.font.some((f) =>
                          typeof f === "object"
                            ? f.name === option.name
                            : f === option.name
                        )}
                        onChange={() => handleCheckboxChange("font", option)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <span
                        className="text-sm whitespace-nowrap"
                        style={{
                          fontFamily: option.cssFamily,
                          color: "#374151",
                        }}
                      >
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Enamel color
                </label>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-2 w-fit">
                  {colorOptions.map((option) => (
                    <label
                      key={option.name}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.color.some((c) =>
                          typeof c === "object"
                            ? c.name === option.name
                            : c === option.name
                        )}
                        onChange={() => handleCheckboxChange("color", option)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                        style={{ accentColor: "var(--primary)" }}
                      />
                      <span
                        className="inline-block w-4 h-4 rounded-full shrink-0 border border-gray-300"
                        style={{ backgroundColor: option.hex }}
                        title={option.hex}
                      />
                      <span className="text-sm text-gray-700 whitespace-nowrap">
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Symbol
                </label>
                <div className="grid grid-cols-3 gap-x-4 gap-y-1 mb-2 w-fit">
                  {symbolOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <label
                        key={option.name}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.symbol.some((s) =>
                            typeof s === "object"
                              ? s.name === option.name
                              : s === option.name
                          )}
                          onChange={() =>
                            handleCheckboxChange("symbol", option)
                          }
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span className="text-lg shrink-0">
                          {IconComponent ? (
                            <IconComponent size={16} />
                          ) : (
                            <span style={{ fontSize: "16px" }}>
                              {option.text}
                            </span>
                          )}
                        </span>
                        <span className="text-sm text-gray-700 whitespace-nowrap">
                          {option.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Symbol Direction
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="symbolDirection"
                      value="left"
                      checked={formData.symbolDirection === "left"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">Left</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="symbolDirection"
                      value="right"
                      checked={formData.symbolDirection === "right"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">Right</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === "details" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Product Details */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product Details
                </label>
                <textarea
                  value={detailsSections.productDetails
                    .map((item) => item.content)
                    .join("\n")}
                  onChange={(e) =>
                    setDetailsSections((prev) => ({
                      ...prev,
                      productDetails: e.target.value
                        .split("\n")
                        .map((content, idx) => ({
                          id: prev.productDetails[idx]?.id || idx + 1,
                          content,
                        })),
                    }))
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Cleaning & Polishing */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Cleaning & Polishing
                </label>
                <textarea
                  value={detailsSections.cleaningPolishing
                    .map((item) => item.content)
                    .join("\n")}
                  onChange={(e) =>
                    setDetailsSections((prev) => ({
                      ...prev,
                      cleaningPolishing: e.target.value
                        .split("\n")
                        .map((content, idx) => ({
                          id: prev.cleaningPolishing[idx]?.id || idx + 1,
                          content,
                        })),
                    }))
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Usage & Color Guarantee */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Usage & Color Guarantee
                </label>
                <textarea
                  value={detailsSections.usageColorGuarantee
                    .map((item) => item.content)
                    .join("\n")}
                  onChange={(e) =>
                    setDetailsSections((prev) => ({
                      ...prev,
                      usageColorGuarantee: e.target.value
                        .split("\n")
                        .map((content, idx) => ({
                          id: prev.usageColorGuarantee[idx]?.id || idx + 1,
                          content,
                        })),
                    }))
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Return & Exchange Policy */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Return & Exchange Policy
                </label>
                <textarea
                  value={detailsSections.returnExchangePolicy
                    .map((item) => item.content)
                    .join("\n")}
                  onChange={(e) =>
                    setDetailsSections((prev) => ({
                      ...prev,
                      returnExchangePolicy: e.target.value
                        .split("\n")
                        .map((content, idx) => ({
                          id: prev.returnExchangePolicy[idx]?.id || idx + 1,
                          content,
                        })),
                    }))
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>

              {/* Our Address & Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Our Address & Contact
                </label>
                <textarea
                  value={detailsSections.addressContact
                    .map((item) => item.content)
                    .join("\n")}
                  onChange={(e) =>
                    setDetailsSections((prev) => ({
                      ...prev,
                      addressContact: e.target.value
                        .split("\n")
                        .map((content, idx) => ({
                          id: prev.addressContact[idx]?.id || idx + 1,
                          content,
                        })),
                    }))
                  }
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm text-black"
                  style={{ "--tw-ring-color": "var(--primary)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-end">
          {activeTab !== "general" && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-2 border border-gray-300 text-gray-900 font-medium rounded-full hover:bg-gray-50 hover:shadow-lg hover:scale-105 transition-all shadow-sm cursor-pointer"
            >
              Previous
            </button>
          )}
          {activeTab !== "details" ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNext();
              }}
              style={{ backgroundColor: "var(--primary)" }}
              className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all cursor-pointer shadow-md flex items-center gap-2"
            >
              Next
              <GrFormNextLink size={20} />
            </button>
          ) : (
            <button
              type="submit"
              style={{ backgroundColor: "var(--primary)" }}
              className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all cursor-pointer shadow-md"
            >
              {isEditMode ? "Update Product" : "Publish Product"}
            </button>
          )}
        </div>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title={
          isEditMode
            ? "Product Updated Successfully"
            : "Product Created Successfully"
        }
        message={
          isEditMode
            ? "Your product changes have been saved and updated."
            : "Your new product has been added to the catalog."
        }
        buttonText="Got it"
      />
    </div>
  );
}
