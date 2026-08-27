"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BlogDisplay from "@/components/blog/BlogDisplay";
import { fetchBlogById, deleteBlog } from "@/store/slices/blogsSlice";

export default function BlogDetail({ params }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = use(params);
  const { currentBlog, loading } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [id, dispatch]);

  const handleBack = () => {
    router.push("/blog");
  };

  const handleEdit = () => {
    router.push(`/blog/new?edit=${id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBlog(id)).unwrap();
      router.push("/blog");
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  if (loading || !currentBlog) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <BlogDisplay
      blog={currentBlog}
      onBack={handleBack}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
