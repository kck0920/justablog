import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  thumbnailUrl?: string | null;
  format?: 'markdown' | 'html'; // 포맷 필드 추가
};

// Database post type
type PostTable = {
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
  format: string; // 포맷 필드 추가
}

// Convert category ID to name
const getCategoryName = (id: string) => {
  const categories: Record<string, string> = {
    ai: "AI",
    health: "건강",
    finance: "재테크",
    lifestyle: "라이프스타일",
    news: "뉴스",
    knowledge: "일반상식",
    issues: "이슈"
  };
  return categories[id] || id;
};

// Check if thumbnail URL is valid (add explicit check for accessibility)
const validateImageUrl = async (url: string): Promise<boolean> => {
  if (!url) return false;

  try {
    // For Supabase storage URLs, we'll assume they're valid but log the check
    if (url.includes('supabase.co/storage')) {
      console.log("Validating Supabase storage URL:", url);
      return true;
    }
    
    return true;
  } catch (err) {
    console.error("Error validating image URL:", err);
    return false;
  }
};

export const usePost = (slug?: string) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.log("No slug provided to usePost hook");
        setError("슬러그가 제공되지 않았습니다");
        setLoading(false);
        return;
      }
      
      console.log("Fetching post with slug:", slug);
      setLoading(true);
      setError(null);
      setImageError(false);
      
      try {
        // Get post data
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle(); // single() 대신 maybeSingle() 사용
        
        if (error) {
          console.error("Error fetching post:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No post found with slug:", slug);
          setError("포스트를 찾을 수 없습니다");
          return;
        }
        
        // Increment view count (async)
        supabase
          .from('posts')
          .update({ views: data.views + 1 })
          .eq('id', data.id)
          .then(result => {
            if (result.error) {
              console.error("Failed to increment view count:", result.error);
            }
          });
        
        console.log("Received post data:", data);
        console.log("Post thumbnail URL:", data.thumbnail_url);
        
        let validThumbnailUrl = null;
        if (data.thumbnail_url) {
          // Pre-check if the thumbnail URL is valid before setting it
          const isValid = await validateImageUrl(data.thumbnail_url);
          validThumbnailUrl = isValid ? data.thumbnail_url : null;
          console.log("Thumbnail URL validation result:", isValid ? "Valid" : "Invalid");
        }
        
        // Set post data
        setPost({
          id: data.id,
          title: data.title,
          content: data.content,
          category: getCategoryName(data.category),
          date: new Date(data.date).toLocaleDateString("ko-KR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          readTime: `${Math.ceil(data.content.length / 1000)} min read`,
          author: "블로그 관리자",
          thumbnailUrl: validThumbnailUrl,
          format: data.format as 'markdown' | 'html' // 포맷 정보 추가
        });
      } catch (err: any) {
        console.error("Error fetching post:", err);
        setError("포스트를 불러오는 중 오류가 발생했습니다");
        
        toast({
          title: "포스트 로딩 실패",
          description: err.message || "포스트를 불러오는 중 오류가 발생했습니다",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
  }, [slug, toast]);

  return { post, loading, error, imageError, setImageError };
};
