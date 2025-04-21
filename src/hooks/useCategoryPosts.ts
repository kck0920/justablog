import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Post, PostTable } from "@/types/post";
import { stripHtmlAndMarkdown } from "@/utils/textUtils";
import { getCategoryTitle } from "@/hooks/useCategories";

export const useCategoryPosts = (categoryId: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        console.log('Fetching posts for category:', categoryId);
        
        let query = supabase
          .from('posts')
          .select('*')
          .eq('status', 'published') as any;
        
        if (categoryId === 'featured') {
          query = query.eq('featured', true);
        } else if (categoryId !== 'all' && categoryId !== undefined) {
          console.log('Filtering by category:', categoryId);
          query = query.eq('category', categoryId);
        }
        
        const { data, error } = await query.order('date', { ascending: false }) as { data: PostTable[] | null, error: any };
        
        if (error) throw error;
        
        console.log('Received posts:', data);
        
        const formattedPosts: Post[] = (data || []).map(post => {
          // HTML 태그와 마크다운 문법이 제거된 순수 텍스트 추출
          const plainContent = stripHtmlAndMarkdown(post.content);
          return {
            id: post.id,
            title: post.title,
            excerpt: plainContent.substring(0, 150) + (plainContent.length > 150 ? '...' : ''),
            category: getCategoryTitle(post.category),
            date: new Date(post.date).toLocaleDateString("ko-KR", {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            readTime: `${Math.ceil(post.content.length / 1000)} min read`,
            slug: post.slug,
            thumbnailUrl: post.thumbnail_url
          };
        });
        
        console.log('Formatted posts:', formattedPosts);
        setPosts(formattedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [categoryId]);

  return { posts, loading };
};
