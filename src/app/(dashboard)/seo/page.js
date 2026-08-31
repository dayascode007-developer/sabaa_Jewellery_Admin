"use client";

import { useState } from "react";
import Analytics from "@/components/seo/Analytics";
import RealtimeAnalytics from "@/components/seo/RealtimeAnalytics";

export default function SEO() {
  const [activeTab, setActiveTab] = useState("realtime");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("realtime")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "realtime"
              ? "border-[#430121] text-[#430121]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" />
          </svg>
          Live Analytics
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "overview"
              ? "border-[#430121] text-[#430121]"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Overview (30 days)
        </button>
      </div>

      {/* Content */}
      {activeTab === "realtime" && <RealtimeAnalytics />}
      {activeTab === "overview" && <Analytics />}
    </div>
  );
}
