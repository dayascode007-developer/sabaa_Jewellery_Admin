"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRealtimeAnalytics } from "@/store/slices/analyticsRealtimeSlice";

export default function RealtimeAnalytics() {
  const dispatch = useDispatch();
  const realtimeState = useSelector((state) => state?.analyticsRealtime);
  const { data, loading, error, lastUpdated } = realtimeState || {
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  };
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    dispatch(fetchRealtimeAnalytics());
  }, [dispatch]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(fetchRealtimeAnalytics());
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, dispatch]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleTimeString();
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-lg"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-40 bg-gray-200 rounded-lg"></div>
        <div className="h-40 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  if (loading && !data) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
        <h3 className="font-semibold mb-2">Error Loading Real-Time Analytics</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-normal text-gray-900">Live Overview</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time analytics updates</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">
            Last updated: {formatTime(lastUpdated)}
          </span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${
              autoRefresh
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              {autoRefresh ? (
                <circle cx="10" cy="10" r="8" />
              ) : (
                <circle cx="10" cy="10" r="8" opacity="0.5" />
              )}
            </svg>
            {autoRefresh ? "Live" : "Paused"}
          </button>
        </div>
      </div>

      {/* Active Users Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Active Users Right Now</p>
          <div className="text-6xl font-light text-green-600 mb-2">
            {data?.activeUsers || 0}
          </div>
          <p className="text-xs text-gray-500">Users currently on your site</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Page Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-4">Page Views (last 24h)</p>
          <div className="text-4xl font-light text-blue-600 mb-2">
            {data?.pageViews || 0}
          </div>
          <p className="text-xs text-gray-500">Pages viewed in the last 24 hours</p>
        </div>

        {/* Timestamp */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-4">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-900">Live Feed Active</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Updates every 10 seconds</p>
        </div>
      </div>

      {/* Top Pages */}
      {data?.topPages && data.topPages.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Top Pages (Last 24h)</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data.topPages.map((page, idx) => (
              <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {page.pageTitle || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500">{page.pagePath}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    {page.screenPageViews}
                  </p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">No page views data available yet</p>
        </div>
      )}

      {/* Top Countries */}
      {data?.topCountries && data.topCountries.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Traffic by Country (Last 24h)</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {data.topCountries.map((item, idx) => (
              <div key={idx} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                <span className="text-sm text-gray-900">{item.country}</span>
                <span className="text-sm font-semibold text-blue-600">
                  {item.activeUsers} users
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">No country data available yet</p>
        </div>
      )}
    </div>
  );
}
