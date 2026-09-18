import Link from "next/link";

export default function TopProducts({ products, loading }) {
  const list = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          Top Selling Products
        </h3>
        <Link
          href="/products"
          className="text-sm  font-semibold whitespace-nowrap"
          style={{ color: "var(--primary)" }}
        >
          View All
        </Link>
      </div>
      <div className="p-6 space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="h-3 flex-1 rounded bg-gray-100 animate-pulse" />
            </div>
          ))
        ) : list.length === 0 ? (
          <p className="text-sm text-gray-500">No products sold yet</p>
        ) : (
          list.map((product, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-lg shrink-0">
                💍
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
              </div>
              <p className="text-sm font-semibold text-red-600 whitespace-nowrap">
                {product.sold} Sold
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
