"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MdArrowForward } from "react-icons/md";

export default function BlogList({ blogs }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleReadMore = (blogId) => {
    router.push(`/blog/${blogId}`);
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header with Add Blog Button and Pagination */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Blogs</h2>
        <div className="flex items-center gap-4">
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                ←
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-gray-900 text-white"
                          : "border border-gray-300 text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                →
              </button>
            </div>
          )}
          <button
            onClick={() => router.push("/blog/new")}
            style={{ backgroundColor: "var(--primary)" }}
            className="px-6 py-2 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all shadow-md cursor-pointer"
          >
            + New Blog
          </button>
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group"
            onClick={() => handleReadMore(blog.id)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                src={blog.mainImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {blog.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{blog.author}</span>
                <span>•</span>
                <span>{blog.publishedDate}</span>
              </div>

              {/* Read More Button */}
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors group-hover:border-blue-600 group-hover:text-blue-600">
                Read More
                <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
