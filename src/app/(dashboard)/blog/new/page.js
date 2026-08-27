"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddBlogForm from "@/components/blog/AddBlogForm";
import { fetchBlogById, clearCurrentBlog } from "@/store/slices/blogsSlice";

export default function NewBlog() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const dispatch = useDispatch();
  const { currentBlog } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (editId) {
      dispatch(fetchBlogById(editId));
    } else {
      dispatch(clearCurrentBlog());
    }
  }, [editId, dispatch]);

  return <AddBlogForm initialBlog={editId ? currentBlog : null} />;
}
