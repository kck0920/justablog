
/**
 * Types for the posts API
 */

// Define a type that matches our database posts table
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
  created_at: string | null;
  updated_at: string | null;
  format: string; // format 필드
}

/**
 * Helper function to convert PostTable to Post format
 */
export const convertPostTableToPost = (postData: PostTable) => ({
  id: postData.id,
  title: postData.title,
  slug: postData.slug,
  status: postData.status,
  category: postData.category,
  date: new Date(postData.date).toISOString().split('T')[0],
  views: postData.views,
  featured: postData.featured,
  thumbnailPreview: postData.thumbnail_url,
  content: postData.content,
  user_id: postData.user_id,
  format: (postData.format || 'markdown') as 'markdown' | 'html' // 타입 캐스팅 추가
});
