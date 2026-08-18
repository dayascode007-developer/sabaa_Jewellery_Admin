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

export const metadata = {
  title: "Dashboard - SaBaa Jewellery Admin",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, Admin! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={MdCurrencyRupee}
          label="Total Sales"
          value="25,60,000"
          change={18.6}
          bgColor="from-[#F3E8F4] to-[#F9F5F8]"
          iconColor="text-purple-500"
        />
        <StatCard
          icon={BsHandbag}
          label="Total Orders"
          value="186"
          change={12.4}
          bgColor="from-[#FEF3E2] to-[#FFECC2]"
          iconColor="text-orange-500"
        />
        <StatCard
          icon={MdOutlineInventory2}
          label="Total Products"
          value="523"
          change={5.7}
          bgColor="from-[#D1F5E0] to-[#ECFDF5]"
          iconColor="text-green-500"
        />
        <StatCard
          icon={MdOutlineWarningAmber}
          label="Low Stock"
          value="7"
          change={-2.3}
          bgColor="from-[#FECDD3] to-[#FEE2E2]"
          iconColor="text-red-500"
        />
        <StatCard
          icon={IoPeopleOutline}
          label="Total Customers"
          value="1,024"
          change={8.3}
          bgColor="from-[#DBEAFE] to-[#EFF6FF]"
          iconColor="text-blue-500"
        />
      </div>

      {/* Charts & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sales Overview - 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        {/* Orders by Status - 1 column */}
        <div className="lg:col-span-1">
          <OrdersChart />
        </div>

        {/* Quick Actions - 1 column */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatestOrders />
        <TopProducts />
      </div>

      {/* Inventory Alerts */}
      <InventoryAlerts />

      {/* Footer */}
      <div className="text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} SaBaa Panchaloga Jewellery. All rights
        reserved.
      </div>
    </div>
  );
}
