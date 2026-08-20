import ProductsTable from "@/components/products/ProductsTable";

export const metadata = {
  title: "All Products - SaBaa Jewellery Admin",
};

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Custom Face Engraved Panchaloga Ring",
      sku: "LN204PE",
      stock: 45,
      originalPrice: "₹1,600",
      price: "₹1,400",
      category: "Rings",
      tags: ["Photo", "Rings"],
      date: "2026/03/27",
      status: "In stock",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Traditional Jimikki",
      sku: "SKU-002",
      stock: 2,
      originalPrice: "₹1,400",
      price: "₹1,200",
      category: "Earrings",
      tags: ["Traditional"],
      date: "2026/03/20",
      status: "Critical",
      rating: 3.8,
    },
    {
      id: 3,
      name: "Panchaloga Chain 22 Inch",
      sku: "SKU-003",
      stock: 8,
      originalPrice: "₹7,200",
      price: "₹6,200",
      category: "Chains",
      tags: ["Classic"],
      date: "2026/03/15",
      status: "In stock",
      rating: 4.2,
    },
    {
      id: 4,
      name: "Panchaloga Bracelet",
      sku: "SKU-004",
      stock: 10,
      originalPrice: "₹3,800",
      price: "₹3,450",
      category: "Bracelets",
      tags: ["Wedding"],
      date: "2026/03/10",
      status: "Low stock",
      rating: 4.7,
    },
    {
      id: 5,
      name: "Meena Lakshmi Ring",
      sku: "SKU-006",
      stock: 12,
      originalPrice: "₹4,200",
      price: "₹3,800",
      category: "Rings",
      tags: ["Gemstone"],
      date: "2026/03/05",
      status: "In stock",
      rating: 4.9,
    },
    {
      id: 6,
      name: "Gold Necklace",
      sku: "SKU-007",
      stock: 1,
      originalPrice: "₹9,500",
      price: "₹8,500",
      category: "Necklaces",
      tags: ["Luxury"],
      date: "2026/02/28",
      status: "Critical",
      rating: 4.4,
    },
    {
      id: 7,
      name: "Silver Pendant",
      sku: "SKU-008",
      stock: 25,
      originalPrice: "₹1,800",
      price: "₹1,500",
      category: "Pendants",
      tags: ["Classic"],
      date: "2026/02/20",
      status: "In stock",
      rating: 4.1,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-1">Manage your jewellery products</p>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} />
    </div>
  );
}
