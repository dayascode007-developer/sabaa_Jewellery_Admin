"use client";

import Loader from "./Loader";

export default function PageLoader({ isLoading = true, children }) {
  if (!isLoading) {
    return children;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader size="xl" text="Loading page..." />
    </div>
  );
}
