"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { MdMenu, MdSearch } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { navigationItems } from "@/config/navigation";
import UserDropdown from "@/components/common/UserDropdown";
import { fetchAdminDetails } from "@/store/slices/adminAuthSlice";

export default function Header({ isCollapsed, pathname }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { admin, token, isHydrated } = useSelector((state) => state.adminAuth);

  // Fetch admin details
  useEffect(() => {
    if (token && isHydrated) {
      dispatch(fetchAdminDetails(token));
    }
  }, [token, isHydrated, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/") return "Dashboard";
    for (const item of navigationItems) {
      if (item.submenu) {
        for (const subitem of item.submenu) {
          if (pathname === subitem.href) return subitem.name;
        }
      } else if (pathname === item.href) {
        return item.name;
      }
    }
    return "Dashboard";
  };

  const toggleSidebar = () => {
    const params = new URLSearchParams(searchParams);
    if (isCollapsed) {
      params.delete("sidebar");
    } else {
      params.set("sidebar", "collapsed");
    }
    return `${pathname}?${params.toString()}`;
  };

  return (
    <header
      className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 fixed top-0 right-0 z-40 transition-all duration-800 ease-in-out"
      style={{ left: isCollapsed ? "80px" : "256px" }}
    >
      <div className="flex items-center gap-4">
        <Link
          href={toggleSidebar()}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          <MdMenu className="w-6 h-6" />
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">
          {getPageTitle()}
        </h2>
      </div>
      <div className="flex items-center bg-gray-100 rounded-lg w-80 border border-gray-300">
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="px-4 py-2 bg-transparent text-sm text-gray-700 flex-1 focus:outline-none"
          style={{ "--tw-ring-color": "var(--primary)" }}
        />
        <button className="px-3 text-gray-600 hover:text-gray-900">
          <MdSearch className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 border border-gray-300 hover:border-gray-400 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
          <IoIosNotificationsOutline className="w-6 h-6" />
          <span
            className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white font-bold rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          >
            1
          </span>
        </button>
        <button className="relative p-2 border border-gray-300 hover:border-gray-400 rounded-full text-gray-600 hover:text-gray-900 transition-colors">
          <IoChatboxEllipsesOutline className="w-6 h-6" />
          <span
            className="absolute -top-2 -right-1 w-5 h-5 flex items-center justify-center text-xs text-white font-bold rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
          >
            1
          </span>
        </button>
        <div
          ref={dropdownRef}
          className="flex items-center gap-3 pl-6 border-l border-gray-200 relative"
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">
                {admin?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
            <FaChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 z-50">
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
