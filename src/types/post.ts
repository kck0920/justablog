export type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  slug: string;
  thumbnailUrl: string | null;
  content: string;
};

// Database post type
export type PostTable = {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  category: string;
  date: string;
  views: number;
  featured: boolean;
  thumbnail_url: string | null;
  user_id: string | null;
}
