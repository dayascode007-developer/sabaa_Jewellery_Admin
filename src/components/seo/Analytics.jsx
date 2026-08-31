"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnalytics } from "@/store/slices/analyticsSlice";

export default function Analytics() {
  const dispatch = useDispatch();
  const analyticsState = useSelector((state) => state?.analytics);
  const { data, loading, error } = analyticsState || { data: null, loading: true, error: null };
  const [activeMetric, setActiveMetric] = useState("Active Users");

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const MetricBox = ({ label, value, onClick }) => (
    <div
      className="relative flex flex-col gap-2 cursor-pointer transition-opacity duration-200 hover:opacity-80 pt-3"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
          {label}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
      <div className="text-4xl font-light text-gray-900">{value}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Top Metrics Skeleton - Horizontal */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Info Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Top Pages Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </div>
          <div className="space-y-0 divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4 flex justify-between">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown Skeleton */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading Analytics</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics Row - Google Analytics Style */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-4 gap-8">
          {/* Active Users */}
          <div className="relative">
            <div
              className={`absolute top-0 left-1 w-24 h-1 rounded-full transition-all duration-500 ${
                activeMetric === "Active Users" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
              }`}
              style={{
                backgroundColor: "#430121",
                transformOrigin: "left",
              }}
            ></div>
            <MetricBox
              label="Active Users"
              value={data?.activeUsers || 0}
              onClick={() => setActiveMetric("Active Users")}
            />
          </div>

          {/* Page Views */}
          <div className="relative">
            <div
              className={`absolute top-0 left-1 w-24 h-1 rounded-full transition-all duration-500 ${
                activeMetric === "Page Views" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
              }`}
              style={{
                backgroundColor: "#430121",
                transformOrigin: "left",
              }}
            ></div>
            <MetricBox
              label="Page Views"
              value={data?.pageViews || 0}
              onClick={() => setActiveMetric("Page Views")}
            />
          </div>

          {/* Bounce Rate */}
          <div className="relative">
            <div
              className={`absolute top-0 left-1 w-24 h-1 rounded-full transition-all duration-500 ${
                activeMetric === "Bounce Rate" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
              }`}
              style={{
                backgroundColor: "#430121",
                transformOrigin: "left",
              }}
            ></div>
            <MetricBox
              label="Bounce Rate"
              value={`${data?.bounceRate || "0.00"}%`}
              onClick={() => setActiveMetric("Bounce Rate")}
            />
          </div>

          {/* Avg Session Duration */}
          <div className="relative">
            <div
              className={`absolute top-0 left-1 w-24 h-1 rounded-full transition-all duration-500 ${
                activeMetric === "Avg Session Duration" ? "opacity-100 scale-x-100" : "opacity-0 scale-x-75"
              }`}
              style={{
                backgroundColor: "#430121",
                transformOrigin: "left",
              }}
            ></div>
            <MetricBox
              label="Avg Session Duration"
              value={`${data?.avgSessionDuration || "0.00"}s`}
              onClick={() => setActiveMetric("Avg Session Duration")}
            />
          </div>
        </div>
      </div>

      {/* Right Side Info Boxes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Active Users (Last 30 Min)</h3>
          <p className="text-3xl font-light text-gray-900 mb-4">0</p>
          <div className="text-xs text-gray-500">Real-time data</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Active Users Per Minute</h3>
          <div className="h-24 bg-gray-50 rounded flex items-center justify-center text-sm text-gray-500">
            No data available
          </div>
        </div>
      </div>

      {/* Top Pages */}
      {data?.topPages && data.topPages.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900">Top Pages</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Page</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-600">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topPages.slice(0, 10).map((page, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="text-sm text-gray-900">{page.pageTitle || "Untitled"}</div>
                      <div className="text-xs text-gray-500">{page.pagePath}</div>
                    </td>
                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                      {page.screenPageViews}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Device Breakdown */}
      {data?.deviceCategory && data.deviceCategory.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-medium text-gray-900 mb-6">Traffic by Device</h2>
          <div className="space-y-4">
            {data.deviceCategory.map((device, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-900 font-medium">{device.deviceCategory}</span>
                  <span className="text-gray-600">{device.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
