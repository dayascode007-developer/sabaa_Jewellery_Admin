"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { navigationItems } from "@/config/navigation";
import logoImg from "@/assets/logo/Sabaa-LOGO.webp";
import {
  MdOutlineCategory,
  MdOutlineInventory2,
  MdOutlineLocalOffer,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { FaRegStar } from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import { BsHandbag } from "react-icons/bs";
import { IoPeopleOutline, IoSettingsOutline } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";
import { GrSearchAdvanced } from "react-icons/gr";
const iconMap = {
  dashboard: RxDashboard,
  products: MdOutlineCategory,
  orders: BsHandbag,
  customers: IoPeopleOutline,
  inventory: MdOutlineInventory2,
  coupons: MdOutlineLocalOffer,
  reviews: FaRegStar,
  blog: FiFileText,
  seo: GrSearchAdvanced,
  settings: IoSettingsOutline,
};

export default function Sidebar({ isCollapsed, pathname }) {
  const searchParams = useSearchParams();
  const expandedMenu = searchParams.get("expand");

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const isActive = (href) => pathname === href;

  return (
    <aside className="bg-white text-gray-900 h-screen fixed left-0 top-0 border-r border-gray-200 flex flex-col z-50 transition-all duration-800 ease-in-out" style={{pointerEvents: "auto", width: isCollapsed ? "80px" : "256px"}}>
      <div className="text-white p-3 flex-shrink-0 flex items-center justify-center border-b">
        {!isCollapsed && <Image src={logoImg} alt="SaBaa Logo" width={70} height={40} priority className="object-contain" />}
        {isCollapsed && <Link href={pathname} className="p-2 hover:bg-gray-100 rounded transition-colors text-black text-lg font-bold" title="Expand">»</Link>}
      </div>
      <nav className="flex-1" style={{pointerEvents: "auto", overflowY: "auto", paddingLeft: "12px", paddingRight: "12px"}}>
        {navigationItems.map((item) => (
          <div key={item.name}>
            {item.submenu ? (
              <>
                <Link href={isCollapsed ? "#" : (expandedMenu === item.name ? pathname : `${pathname}?expand=${item.name}`)} onClick={(e) => isCollapsed && e.preventDefault()} title={item.name} className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-left cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-black">{getIcon(item.icon)}</span>
                    {!isCollapsed && <span className="font-medium text-[17px] text-black">{item.name}</span>}
                  </div>
                  {!isCollapsed && <MdKeyboardArrowRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0`} style={{transform: expandedMenu === item.name ? "rotate(90deg)" : "rotate(0deg)"}} />}
                </Link>
                {!isCollapsed && (
                  <div className={`ml-6 space-y-1 mt-1 overflow-hidden ${expandedMenu === item.name ? "submenu-enter" : "submenu-exit"}`}>
                    {item.submenu.map((subitem) => (
                      <Link key={subitem.name} href={`${subitem.href}?expand=${item.name}`} className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isActive(subitem.href) ? "bg-[#430121] text-white" : "text-black hover:bg-gray-50"}`}>
                        <span>•&nbsp;&nbsp;{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link href={item.href} title={item.name} className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive(item.href) ? "bg-[#430121] text-white" : "text-black hover:bg-gray-50"}`}>
                <div className="flex items-center gap-3">
                  <span>{getIcon(item.icon)}</span>
                  {!isCollapsed && <span className="font-medium text-[17px]">{item.name}</span>}
                </div>
                {!isCollapsed && <MdKeyboardArrowRight className="w-5 h-5 text-gray-400" />}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
