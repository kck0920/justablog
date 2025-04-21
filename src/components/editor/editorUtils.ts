
import { Post } from "@/types/admin";

export const categories = [
  { id: "ai", name: "AI" },
  { id: "health", name: "건강" },
  { id: "finance", name: "재테크" },
  { id: "lifestyle", name: "라이프스타일" },
  { id: "news", name: "뉴스" },
  { id: "knowledge", name: "일반상식" },
  { id: "issues", name: "이슈" },
];

export const getCategoryName = (categoryId: string): string => {
  return categories.find(cat => cat.id === categoryId)?.name || categoryId;
};

export const createFormDataFromPost = (post: Post | null): Post => {
  return {
    id: post?.id || null,
    title: post?.title || "",
    content: post?.content || "",
    category: post?.category || "",
    featured: post?.featured || false,
    thumbnailPreview: post?.thumbnailPreview || null,
    slug: post?.slug || "",
    status: post?.status || "draft",
    date: post?.date || new Date().toISOString().split('T')[0],
    views: post?.views || 0
  };
};
