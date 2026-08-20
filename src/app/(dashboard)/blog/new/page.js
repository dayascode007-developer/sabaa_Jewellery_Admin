"use client";

import { useSearchParams } from "next/navigation";
import AddBlogForm from "@/components/blog/AddBlogForm";
import { useEffect, useState } from "react";

export default function NewBlog() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [initialBlog, setInitialBlog] = useState(null);

  useEffect(() => {
    if (editId) {
      const blog = {
        id: 1,
        title: "The Art of Panchalogam: A Golden Blend",
        description:
          "Panchalogam, meaning 'five metals' in Sanskrit, is a traditional alloy that has been cherished for centuries. It combines copper, bronze, pewter, and silver to create a unique golden shine that's both durable and beautiful.",
        mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop",
        author: "Aakash Kumar",
        authorBio:
          "Master craftsman with 15+ years of experience in traditional jewelry making. Passionate about preserving ancient techniques while embracing modern design.",
        publishedDate: "January 15, 2024",
        content: [
          {
            id: 1,
            heading: "The Legacy of Panchalogam",
            text: "<p>For generations, artisans have relied on the unique properties of Panchalogam. This five-metal alloy creates a warm golden hue that doesn't fade with time. The combination of metals ensures durability while maintaining flexibility for intricate designs.</p><p>What makes Panchalogam special is its ability to be shaped into the finest details without losing its structural integrity. Each piece crafted from this alloy carries forward a tradition that spans centuries.</p>",
            image:
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
          },
          {
            id: 2,
            heading: "The Craftsmanship Process",
            text: "<p>Creating jewelry from Panchalogam requires years of training and precision. Our master craftsmen follow time-honored techniques passed down through generations.</p><p>The process begins with carefully selecting and measuring the right proportion of each metal. The metals are then melted at precise temperatures to create the perfect alloy. Once cooled, the metal is shaped, carved, and polished to perfection. Every step requires expertise and attention to detail that can only come from years of dedicated practice.</p>",
            image:
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
          },
          {
            id: 3,
            heading: "Why Choose Panchalogam?",
            text: "<p>Panchalogam offers several advantages over other jewelry materials:</p><ol><li><strong>Durability</strong> - The five-metal composition creates a strong, long-lasting alloy</li><li><strong>Hypoallergenic</strong> - Ideal for sensitive skin, especially when crafted properly</li><li><strong>Timeless Appeal</strong> - The warm golden tone never goes out of style</li><li><strong>Cultural Significance</strong> - Carries the heritage of ancient Indian craftsmanship</li><li><strong>Value</strong> - Maintains its beauty and integrity for generations</li></ol><p>When you choose Panchalogam, you're not just selecting a beautiful piece of jewelry – you're becoming part of a tradition that honors both artistry and heritage.</p>",
            image:
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop",
          },
        ],
      };
      setInitialBlog(blog);
    }
  }, [editId]);

  return <AddBlogForm initialBlog={initialBlog} />;
}
