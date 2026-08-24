import ProductsList from "@/components/products/ProductsList";

export const metadata = {
  title: "All Products - SaBaa Jewellery Admin",
};

export default function Products() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-600 mt-1">Manage your jewellery products</p>
      </div>

      {/* Products Table with Real Data */}
      <ProductsList />
    </div>
  );
}
