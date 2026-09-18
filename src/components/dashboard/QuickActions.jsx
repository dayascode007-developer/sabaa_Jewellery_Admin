"use client";

import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdShoppingCart,
  MdLocalOffer,
  MdVisibility,
} from "react-icons/md";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    { label: "Add New Product", icon: MdAdd, href: "/products/add" },
    { label: "Manage Orders", icon: MdShoppingCart, href: "/orders" },
    { label: "Coupons", icon: MdLocalOffer, href: "/coupons" },
    { label: "View Store", icon: MdVisibility, href: "/inventory" },
  ];

  const handleClick = (href) => {
    if (href !== "#") {
      router.push(href);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleClick(action.href)}
              disabled={action.href === "#"}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300 transition-colors disabled:cursor-not-allowed text-left"
            >
              <IconComponent className="text-lg text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
