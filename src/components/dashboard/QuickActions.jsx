import {
  MdAdd,
  MdShoppingCart,
  MdFileDownload,
  MdLocalOffer,
  MdImage,
  MdVisibility,
} from "react-icons/md";

export default function QuickActions() {
  const actions = [
    { label: "Add New Product", icon: MdAdd, href: "#" },
    { label: "Manage Orders", icon: MdShoppingCart, href: "#" },
    { label: "Import Products", icon: MdFileDownload, href: "#" },
    { label: "Coupons", icon: MdLocalOffer, href: "#" },
    { label: "Add Banner", icon: MdImage, href: "#" },
    { label: "View Store", icon: MdVisibility, href: "#" },
  ];

  return (
    <div className="bg-white  p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <a
              key={index}
              href={action.href}
              className="flex items-center gap-3 px-4 py-3  bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <IconComponent className="text-lg text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">
                {action.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
