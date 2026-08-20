import BlogList from "@/components/blog/BlogList";

export const metadata = {
  title: "Blog - SaBaa Jewellery Admin",
};

export default function Blog() {
  const blogs = [
    {
      id: 1,
      title: "The Art of Panchalogam: A Golden Blend",
      mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=250&fit=crop",
      author: "Aakash Kumar",
      publishedDate: "Jan 15, 2024",
    },
    {
      id: 2,
      title: "Jewelry Care: Maintaining Your Shine",
      mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=250&fit=crop",
      author: "Priya Sharma",
      publishedDate: "Jan 10, 2024",
    },
    {
      id: 3,
      title: "Sustainable Jewelry: Our Commitment",
      mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=250&fit=crop",
      author: "Rohan Singh",
      publishedDate: "Jan 5, 2024",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
        <p className="text-gray-600 mt-1">Manage and read jewelry blogs</p>
      </div>

      {/* Blog List */}
      <BlogList blogs={blogs} />
    </div>
  );
}
