import InventoryTable from "@/components/inventory/InventoryTable";

export const metadata = {
  title: "Inventory - SaBaa Jewellery Admin",
};

export default function Inventory() {
  const inventoryItems = [
    {
      id: 1,
      product: "Panchaloga Lakshmi Ring",
      sku: "SKU-001",
      category: "Rings",
      stock: 2,
      status: "low",
      lowStockThreshold: 5,
    },
    {
      id: 2,
      product: "Traditional Jimikki",
      sku: "SKU-002",
      category: "Earrings",
      stock: 0,
      status: "out-of-stock",
      lowStockThreshold: 3,
    },
    {
      id: 3,
      product: "Panchaloga Chain 22 Inch",
      sku: "SKU-003",
      category: "Chains",
      stock: 8,
      status: "in-stock",
      lowStockThreshold: 5,
    },
    {
      id: 4,
      product: "Panchaloga Bracelet",
      sku: "SKU-004",
      category: "Bracelets",
      stock: 10,
      status: "low",
      lowStockThreshold: 15,
    },
    {
      id: 5,
      product: "Panchaloga Anklet",
      sku: "SKU-005",
      category: "Anklets",
      stock: 2,
      status: "low",
      lowStockThreshold: 5,
    },
    {
      id: 6,
      product: "Meena Lakshmi Ring",
      sku: "SKU-006",
      category: "Rings",
      stock: 12,
      status: "in-stock",
      lowStockThreshold: 5,
    },
    {
      id: 7,
      product: "Gold Necklace",
      sku: "SKU-007",
      category: "Necklaces",
      stock: 0,
      status: "out-of-stock",
      lowStockThreshold: 3,
    },
    {
      id: 8,
      product: "Silver Pendant",
      sku: "SKU-008",
      category: "Pendants",
      stock: 25,
      status: "in-stock",
      lowStockThreshold: 10,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-600 mt-1">
          Manage product stock levels and inventory alerts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg p-6 shadow-sm border-l-4"
          style={{ borderLeftColor: "var(--primary)" }}
        >
          <p className="text-gray-600 text-sm">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Critical Stock</p>
          <p className="text-3xl font-bold text-red-600 mt-2">2</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Low Stock</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">In Stock</p>
          <p className="text-3xl font-bold text-green-600 mt-2">3</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 text-black"
              style={{ "--tw-ring-color": "var(--primary)" }}
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
            <option>All Categories</option>
            <option>Rings</option>
            <option>Earrings</option>
            <option>Chains</option>
            <option>Bracelets</option>
            <option>Anklets</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-black">
            <option>All Status</option>
            <option>Critical</option>
            <option>Low</option>
            <option>In Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable inventoryItems={inventoryItems} />
    </div>
  );
}
