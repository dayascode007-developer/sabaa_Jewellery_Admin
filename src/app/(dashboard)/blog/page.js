import BlogList from "@/components/blog/BlogList";

export const metadata = {
  title: "Blog - SaBaa Jewellery Admin",
};

export default function Blog() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-600 mt-1">Manage and read jewelry blogs</p>
      </div>

      {/* Blog List */}
      <BlogList />
    </div>
  );
}
