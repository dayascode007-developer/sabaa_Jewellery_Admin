export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const ORDER_STATUS = {
  NEW: "New",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const PRODUCT_CATEGORIES = [
  "Rings",
  "Necklaces",
  "Bracelets",
  "Earrings",
  "Anklets",
  "Bangles",
  "Chains",
];

export const CURRENCY = "₹";
