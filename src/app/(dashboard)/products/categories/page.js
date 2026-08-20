import CategoriesTable from "@/components/categories/CategoriesTable";

export const metadata = {
  title: "Categories - SaBaa Jewellery Admin",
};

export default function Categories() {
  const categories = [
    { id: 1, name: "Rings", productCount: 15 },
    { id: 2, name: "Earrings", productCount: 12 },
    { id: 3, name: "Necklaces", productCount: 8 },
    { id: 4, name: "Bracelets", productCount: 10 },
    { id: 5, name: "Anklets", productCount: 6 },
    { id: 6, name: "Chains", productCount: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-1">Manage product categories</p>
      </div>

      {/* Categories Table */}
      <CategoriesTable categories={categories} />
    </div>
  );
}
