"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { MdArrowForward } from "react-icons/md";
import { fetchBlogs } from "@/store/slices/blogsSlice";
import SkeletonLoader from "@/components/common/SkeletonLoader";

export default function BlogList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector((state) => state.blogs);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 100, offset: 0 }));
  }, [dispatch]);

  const handleReadMore = (blogId) => {
    router.push(`/blog/${blogId}`);
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = blogs.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <SkeletonLoader type="card" count={3} />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Blog Button and Pagination */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">All Blogs</h2>
        <div className="flex items-center gap-4">
          {/* Pagination */}
          {blogs.length > 0 && totalPages > 1 && (
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

      {/* Empty State */}
      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg font-medium">No Blogs</p>
        </div>
      ) : (
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
                src={blog.main_image || blog.mainImage}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 transition-colors">
                {blog.title}
              </h3>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{blog.publishedDate}</span>
              </div>

              {/* Read More Button */}
              <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Read More
                <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
