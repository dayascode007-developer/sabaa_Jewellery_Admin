"use client";

import { useCallback, useEffect, useState } from "react";
import StatCard from "@/components/common/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import OrdersChart from "@/components/dashboard/OrdersChart";
import LatestOrders from "@/components/dashboard/LatestOrders";
import TopProducts from "@/components/dashboard/TopProducts";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import QuickActions from "@/components/dashboard/QuickActions";
import {
  MdCurrencyRupee,
  MdOutlineInventory2,
  MdOutlineWarningAmber,
} from "react-icons/md";
import { BsHandbag } from "react-icons/bs";
import { IoPeopleOutline } from "react-icons/io5";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const count = (value) => Number(value || 0).toLocaleString("en-IN");
const rupees = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (selectedPeriod) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/dashboard?period=${selectedPeriod}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.message || "Failed to load dashboard");
      setData(body.data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(period);
  }, [load, period]);

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, Admin! Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={MdCurrencyRupee}
          label="Total Sales"
          value={loading ? "..." : rupees(stats?.totalSales)}
          bgColor="from-[#F3E8F4] to-[#F9F5F8]"
          iconColor="text-purple-500"
        />
        <StatCard
          icon={BsHandbag}
          label="Total Orders"
          value={loading ? "..." : count(stats?.totalOrders)}
          bgColor="from-[#FEF3E2] to-[#FFECC2]"
          iconColor="text-orange-500"
        />
        <StatCard
          icon={MdOutlineInventory2}
          label="Total Products"
          value={loading ? "..." : count(stats?.totalProducts)}
          bgColor="from-[#D1F5E0] to-[#ECFDF5]"
          iconColor="text-green-500"
        />
        <StatCard
          icon={MdOutlineWarningAmber}
          label="Low Stock"
          value={loading ? "..." : count(stats?.lowStock)}
          bgColor="from-[#FECDD3] to-[#FEE2E2]"
          iconColor="text-red-500"
        />
        <StatCard
          icon={IoPeopleOutline}
          label="Total Customers"
          value={loading ? "..." : count(stats?.totalCustomers)}
          bgColor="from-[#DBEAFE] to-[#EFF6FF]"
          iconColor="text-blue-500"
        />
      </div>

      {/* Charts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <SalesChart
            data={data?.sales}
            period={period}
            onPeriodChange={setPeriod}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-1">
          <OrdersChart counts={data?.ordersByStatus} loading={loading} />
        </div>

        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestOrders orders={data?.latestOrders} loading={loading} />
        <TopProducts products={data?.topProducts} loading={loading} />
      </div>

      <InventoryAlerts alerts={data?.inventoryAlerts} loading={loading} />

      {/* Footer */}
      <div className="text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} SaBaa Panchaloga Jewellery. All rights reserved.
      </div>
    </div>
  );
}
