"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { loadAdminFromStorage } from "@/store/slices/adminAuthSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";
import InventoryAlertModal from "@/components/common/InventoryAlertModal";

export default function DashboardLayout({ children }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.adminAuth);
  const isCollapsed = searchParams.get("sidebar") === "collapsed";

  const { isHydrated } = useSelector((state) => state.adminAuth);

  // Load auth state from localStorage and check if authenticated
  useEffect(() => {
    dispatch(loadAdminFromStorage());
  }, [dispatch]);

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      console.log("🚀 Not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // Don't render anything until hydration is complete
  if (!isHydrated) {
    return null;
  }

  // If hydrated but not authenticated, show nothing (redirect is happening)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex">
      <InventoryAlertModal />
      <Sidebar isCollapsed={isCollapsed} pathname={pathname} />
      <div className="flex-1 transition-all duration-800 ease-in-out" style={{marginLeft: isCollapsed ? "80px" : "256px"}}>
        <Header isCollapsed={isCollapsed} pathname={pathname} />
        <main className="mt-20 p-8 bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
