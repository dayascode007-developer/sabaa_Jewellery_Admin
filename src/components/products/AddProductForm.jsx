"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { MdClose, MdCloudUpload } from "react-icons/md";
import { PiMicrosoftExcelLogoThin } from "react-icons/pi";
import BulkUploadModal from "./BulkUploadModal";
import {
  createProduct,
  updateProduct,
  fetchProducts,
} from "@/store/slices/productsSlice";
import { fetchCategories } from "@/store/slices/categoriesSlice";
import { fetchSubCategoriesByCategory } from "@/store/slices/subCategoriesSlice";
import { fetchSymbols } from "@/store/slices/symbolsSlice";
import CustomDropdown from "@/components/common/CustomDropdown";
import { GrFormNextLink } from "react-icons/gr";
import SuccessModal from "@/components/modals/SuccessModal";
import ErrorModal from "@/components/modals/ErrorModal";
import AddSymbolModal from "./AddSymbolModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AddProductForm({ productId = null }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading: submitting } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const { subCategories } = useSelector((state) => state.subCategories);
  const { symbols } = useSelector((state) => state.symbols);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAddSymbolModal, setShowAddSymbolModal] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Fetch categories and symbols on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    dispatch(fetchSymbols());
  }, [dispatch, categories.length]);

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
  const symbolOptions = symbols.map((symbol) => ({
    name: symbol.name,
    image: symbol.url,
  }));

  const subCategoriesData = {
    rings: ["Gold Rings", "Silver Rings", "Diamond Rings"],
    earrings: ["Stud Earrings", "Hoop Earrings", "Chandelier Earrings"],
    necklaces: ["Pendant Necklaces", "Chain Necklaces", "Choker Necklaces"],
    bracelets: ["Bangles", "Tennis Bracelets", "Charm Bracelets"],
    anklets: ["Ankle Chains", "Beaded Anklets", "Traditional Anklets"],
    chains: ["Gold Chains", "Silver Chains", "Mangalsutra"],
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    regularPrice: "",
    salePrice: "",
    sku: "",
    category: "",
    subcategories: [],
    quantity: 0,
    minStock: 0,
    trackStock: false,
    stockStatus: "in-stock",
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
  const [deletedSubImageIds, setDeletedSubImageIds] = useState([]);
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
        const product = decoded.product || decoded.formData;

        if (product) {
          setIsEditMode(true);
          setEditProductId(product.id);

          setFormData({
            title: product.title || "",
            description: product.description || "",
            regularPrice: product.regular_price || "",
            salePrice: product.sale_price || "",
            sku: product.sku || "",
            category: product.category_id || "",
            subcategories: Array.isArray(product.subcategories) ? product.subcategories : [],
            quantity: product.quantity || 0,
            minStock: product.min_stock || 0,
            trackStock: product.track_stock || false,
            stockStatus: product.stock_status || "in-stock",
            limitPurchases: product.limit_purchases || false,
            enableReviews: product.enable_reviews !== false,
            weight: product.weight || "",
            length: product.length || "",
            width: product.width || "",
            height: product.height || "",
            size: Array.isArray(product.ring_sizes) ? product.ring_sizes : [],
            font: Array.isArray(product.fonts) ? product.fonts : [],
            color: Array.isArray(product.colors) ? product.colors : [],
            symbol: Array.isArray(product.symbols) ? product.symbols : [],
            symbolDirection: product.symbol_direction || "",
            productDetails: product.product_details || "",
            cleaningPolishing: product.cleaning_polishing || "",
            usageColorGuarantee: product.usage_color_guarantee || "",
            returnExchangePolicy: product.return_exchange_policy || "",
            addressContact: product.address_contact || "",
          });

          setMainImage(product.main_image || null);

          if (Array.isArray(product.sub_images) && product.sub_images.length > 0) {
            const loadedSubImages = product.sub_images.map((img) => ({
              id: img.id,
              image: img.image_url,
            }));
            setSubImageSlots(loadedSubImages);
            // Set nextSlotId to be one more than the max existing ID to avoid conflicts
            const maxId = Math.max(...loadedSubImages.map(s => s.id));
            setNextSlotId(maxId + 1);
          }

          if (Array.isArray(product.ring_sizes) && product.ring_sizes.length > 0) {
            setRingSizes(product.ring_sizes);
          }

          if (product.product_details || product.cleaning_polishing || product.usage_color_guarantee || product.return_exchange_policy || product.address_contact) {
            setDetailsSections({
              productDetails: Array.isArray(product.product_details) ? product.product_details : detailsSections.productDetails,
              cleaningPolishing: Array.isArray(product.cleaning_polishing) ? product.cleaning_polishing : detailsSections.cleaningPolishing,
              usageColorGuarantee: Array.isArray(product.usage_color_guarantee) ? product.usage_color_guarantee : detailsSections.usageColorGuarantee,
              returnExchangePolicy: Array.isArray(product.return_exchange_policy) ? product.return_exchange_policy : detailsSections.returnExchangePolicy,
              addressContact: Array.isArray(product.address_contact) ? product.address_contact : detailsSections.addressContact,
            });
          }
        }

        sessionStorage.removeItem("editProductData");
        router.replace(window.location.pathname);
      } catch (e) {
        console.error("Failed to load product data:", e);
      }
    }
  }, [router]);

  // Fetch sub categories when category changes
  useEffect(() => {
    if (formData.category) {
      dispatch(fetchSubCategoriesByCategory(formData.category));
    }
  }, [formData.category, dispatch]);

  // Transform subcategories from names to objects with IDs once subCategories are loaded
  useEffect(() => {
    if (
      isEditMode &&
      subCategories.length > 0 &&
      Array.isArray(formData.subcategories) &&
      formData.subcategories.length > 0 &&
      typeof formData.subcategories[0] === "string"
    ) {
      const subCatsWithIds = formData.subcategories
        .map((subCatName) => {
          const found = subCategories.find((sc) => sc.name === subCatName);
          return found ? { id: found.id, name: found.name } : null;
        })
        .filter(Boolean);

      setFormData((prev) => ({
        ...prev,
        subcategories: subCatsWithIds,
      }));
    }
  }, [subCategories, isEditMode]);

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
      setMainImage(file);
    }
  };

  const handleSubImageUpload = (e, slotId) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubImageSlots((prev) =>
        prev.map((slot) =>
          slot.id === slotId ? { ...slot, image: file } : slot
        )
      );
    }
  };

  const removeSubImageSlot = (slotId) => {
    setSubImageSlots((prev) => {
      const slotToRemove = prev.find((slot) => slot.id === slotId);
      // If removing an existing image (URL string), track it for deletion
      if (slotToRemove && typeof slotToRemove.image === "string") {
        setDeletedSubImageIds((prevDeleted) => [...prevDeleted, slotId]);
      }
      return prev.filter((slot) => slot.id !== slotId);
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only submit when on details tab
    if (activeTab === "details") {
      // Create FormData with all collected data
      const submitData = new FormData();

      // Add all form fields
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("regularPrice", formData.regularPrice);
      submitData.append("salePrice", formData.salePrice);
      submitData.append("sku", formData.sku);
      submitData.append("categoryId", formData.category);
      submitData.append(
        "subcategories",
        JSON.stringify(formData.subcategories.map(s => typeof s === "object" ? s.name : s))
      );
      submitData.append("quantity", formData.quantity);
      submitData.append("minStock", formData.minStock);
      submitData.append("trackStock", formData.trackStock);
      submitData.append("stockStatus", formData.stockStatus);
      submitData.append("limitPurchases", formData.limitPurchases);
      submitData.append("enableReviews", formData.enableReviews);
      submitData.append("weight", formData.weight);
      submitData.append("length", formData.length);
      submitData.append("width", formData.width);
      submitData.append("height", formData.height);
      submitData.append("ringSizes", JSON.stringify(ringSizes));
      submitData.append("fonts", JSON.stringify(formData.font));
      submitData.append("colors", JSON.stringify(formData.color));
      submitData.append("symbols", JSON.stringify(formData.symbol.map(s => ({ name: s.name }))));
      submitData.append("symbolDirection", formData.symbolDirection);
      submitData.append(
        "productDetails",
        JSON.stringify(detailsSections.productDetails)
      );
      submitData.append(
        "cleaningPolishing",
        JSON.stringify(detailsSections.cleaningPolishing)
      );
      submitData.append(
        "usageColorGuarantee",
        JSON.stringify(detailsSections.usageColorGuarantee)
      );
      submitData.append(
        "returnExchangePolicy",
        JSON.stringify(detailsSections.returnExchangePolicy)
      );
      submitData.append(
        "addressContact",
        JSON.stringify(detailsSections.addressContact)
      );

      // Add main image if it's a new File (not a string/URL)
      if (mainImage && mainImage instanceof File) {
        submitData.append("mainImage", mainImage);
      }

      // Add sub images only if they're new Files (not existing URLs)
      subImageSlots.forEach((slot) => {
        if (slot.image && slot.image instanceof File) {
          submitData.append("subImages", slot.image);
        }
      });

      // Add deleted sub-image IDs for deletion
      if (deletedSubImageIds.length > 0) {
        submitData.append("deletedSubImageIds", JSON.stringify(deletedSubImageIds));
      }

      // Dispatch Redux action
      if (isEditMode) {
        dispatch(updateProduct({ id: editProductId, formData: submitData }))
          .then((result) => {
            // Check if action was rejected (error)
            if (result.type === updateProduct.rejected.type) {
              setErrorMessage(result.payload || "Failed to update product");
              setShowErrorModal(true);
            } else {
              // Clear edit data cache after successful update
              sessionStorage.removeItem("editProductData");
              // Reset deleted sub-image IDs after successful update
              setDeletedSubImageIds([]);
              // Show success modal immediately
              setShowSuccessModal(true);
            }
          })
          .catch((error) => {
            setErrorMessage(error.message || "Failed to update product");
            setShowErrorModal(true);
          });
      } else {
        dispatch(createProduct(submitData))
          .then((result) => {
            // Check if action was rejected (error)
            if (result.type === createProduct.rejected.type) {
              setErrorMessage(result.payload || "Failed to create product");
              setShowErrorModal(true);
            } else {
              // Success
              setShowSuccessModal(true);
            }
          })
          .catch((error) => {
            setErrorMessage(error.message || "Failed to create product");
            setShowErrorModal(true);
          });
      }
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reload page to refresh all data and images
    setTimeout(() => {
      window.location.href = "/products";
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        {!isEditMode && (
          <button
            type="button"
            onClick={() => setShowBulkUploadModal(true)}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <PiMicrosoftExcelLogoThin size={20} />
            Bulk Upload
          </button>
        )}
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
                <CustomDropdown
                  options={categories}
                  value={formData.category}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  label="Category"
                  placeholder="Select a category"
                  required
                />
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 w-fit">
                    {subCategories.map((subCat) => (
                      <label
                        key={subCat.id}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.subcategories.some(
                            (s) => s.id === subCat.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({
                                ...prev,
                                subcategories: [
                                  ...prev.subcategories,
                                  { id: subCat.id, name: subCat.name },
                                ],
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                subcategories: prev.subcategories.filter(
                                  (s) => s.id !== subCat.id
                                ),
                              }));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span className="text-sm text-gray-700">
                          {subCat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
                  </select>
                </div>
              </div>

              {/* Enable Reviews Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
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
                    className="rounded cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
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
                            src={mainImage instanceof File ? URL.createObjectURL(mainImage) : mainImage}
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
                                src={slot.image instanceof File ? URL.createObjectURL(slot.image) : slot.image}
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
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="trackStock"
                    checked={formData.trackStock}
                    onChange={(e) =>
                      setFormData({ ...formData, trackStock: e.target.checked })
                    }
                    className="rounded cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Track stock quantity for this product{" "}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Stock Status - Always Visible */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Stock status <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="in-stock"
                      checked={formData.stockStatus === "in-stock"}
                      onChange={handleInputChange}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <span className="text-sm text-gray-700">In stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="out-of-stock"
                      checked={formData.stockStatus === "out-of-stock"}
                      onChange={handleInputChange}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    <span className="text-sm text-gray-700">Out of stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      value="on-backorder"
                      checked={formData.stockStatus === "on-backorder"}
                      onChange={handleInputChange}
                      style={{ accentColor: "var(--primary)" }}
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
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Low stock threshold{" "}
                      <span className="text-red-500">*</span>
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
                <label className="flex items-center gap-2 cursor-pointer">
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
                    className="rounded cursor-pointer"
                    style={{ accentColor: "var(--primary)" }}
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
                <label className="flex items-center gap-1.5 cursor-pointer w-fit mb-2">
                  <input
                    type="checkbox"
                    checked={
                      ringSizes.filter((slot) => slot.size).length === 12
                    }
                    onChange={(e) => {
                      const allSizes = [
                        10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
                      ];
                      if (e.target.checked) {
                        const newSlots = [];
                        let maxId = Math.max(...ringSizes.map((s) => s.id), 0);
                        allSizes.forEach((size) => {
                          if (!ringSizes.some((slot) => slot.size === size)) {
                            newSlots.push({ id: ++maxId, size });
                          }
                        });
                        setRingSizes((prev) => [...prev, ...newSlots]);
                        setNextSizeId(maxId + 1);
                      } else {
                        setRingSizes((prev) =>
                          prev.filter((slot) => !allSizes.includes(slot.size))
                        );
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    All
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-x-4 gap-y-2 mb-2 w-fit">
                  {[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(
                    (size) => (
                      <label
                        key={size}
                        className="flex items-center gap-1.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={ringSizes.some((slot) => slot.size === size)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addRingSizeSlot(size);
                            } else {
                              const sizeSlot = ringSizes.find(
                                (slot) => slot.size === size
                              );
                              if (sizeSlot) {
                                removeRingSizeSlot(sizeSlot.id);
                              }
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span className="text-sm text-gray-700 whitespace-nowrap">
                          {size}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Font
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer w-fit mb-2">
                  <input
                    type="checkbox"
                    checked={formData.font.length === fontOptions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        fontOptions.forEach((option) => {
                          if (
                            !formData.font.some((f) => f.name === option.name)
                          ) {
                            handleCheckboxChange("font", option);
                          }
                        });
                      } else {
                        setFormData((prev) => ({ ...prev, font: [] }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    All
                  </span>
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
                <label className="flex items-center gap-1.5 cursor-pointer w-fit mb-2">
                  <input
                    type="checkbox"
                    checked={formData.color.length === colorOptions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        colorOptions.forEach((option) => {
                          if (
                            !formData.color.some((c) => c.name === option.name)
                          ) {
                            handleCheckboxChange("color", option);
                          }
                        });
                      } else {
                        setFormData((prev) => ({ ...prev, color: [] }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    All
                  </span>
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Symbol
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddSymbolModal(true)}
                    style={{ backgroundColor: "var(--primary)" }}
                    className="px-3 py-1 text-white text-xs rounded-lg hover:opacity-90 transition-opacity"
                  >
                    + Add Symbol
                  </button>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer w-fit mb-2">
                  <input
                    type="checkbox"
                    checked={formData.symbol.length === symbolOptions.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        symbolOptions.forEach((option) => {
                          if (
                            !formData.symbol.some((s) => s.name === option.name)
                          ) {
                            handleCheckboxChange("symbol", option);
                          }
                        });
                      } else {
                        setFormData((prev) => ({ ...prev, symbol: [] }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer shrink-0"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    All
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {symbolOptions.map((option) => {
                    const isSelected = formData.symbol.some((s) =>
                      typeof s === "object"
                        ? s.name === option.name
                        : s === option.name
                    );
                    return (
                      <div
                        key={option.name}
                        className="cursor-pointer flex flex-col items-center gap-1 relative"
                      >
                        <div
                          className={`w-16 h-16 rounded-lg border-2 p-1 flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-[var(--primary)] bg-blue-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={option.image}
                            alt={option.name}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleCheckboxChange("symbol", option)
                          }
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          style={{ accentColor: "var(--primary)" }}
                        />
                        <span className="text-xs text-gray-700 text-center">
                          {option.name}
                        </span>
                      </div>
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
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="symbolDirection"
                      value="center"
                      checked={formData.symbolDirection === "center"}
                      onChange={handleInputChange}
                    />
                    <span className="text-sm text-gray-700">Center</span>
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

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        buttonText="OK"
      />

      <BulkUploadModal
        isOpen={showBulkUploadModal}
        onClose={() => setShowBulkUploadModal(false)}
        onUploadSuccess={() => {
          setShowBulkUploadModal(false);
          dispatch(fetchProducts());
        }}
      />

      {/* Add Symbol Modal */}
      <AddSymbolModal
        isOpen={showAddSymbolModal}
        onClose={() => setShowAddSymbolModal(false)}
        onSymbolAdded={() => {
          dispatch(fetchSymbols());
          setShowAddSymbolModal(false);
        }}
      />
    </div>
  );
}
