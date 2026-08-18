export default function TopProducts() {
  const products = [
    { name: "Panchaloga Lakshmi Ring", sold: 125, icon: "💍" },
    { name: "Panchaloga Chain 22 Inch", sold: 98, icon: "⛓️" },
    { name: "Traditional Jimikki", sold: 76, icon: "👂" },
    { name: "Panchaloga Bracelet", sold: 65, icon: "💪" },
    { name: "Panchaloga Anklet", sold: 54, icon: "🦶" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          Top Selling Products
        </h3>
        <a
          href="#"
          className="text-sm  font-semibold whitespace-nowrap"
          style={{ color: "var(--primary)" }}
        >
          View All
        </a>
      </div>
      <div className="p-6 space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg">
              {product.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {product.name}
              </p>
            </div>
            <p className="text-sm font-semibold text-red-600">
              {product.sold} Sold
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
