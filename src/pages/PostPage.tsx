import { useParams, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { usePost } from "@/hooks/usePost";
import { PostHeader } from "@/components/post/PostHeader";
import { PostContent } from "@/components/post/PostContent";
import { PostThumbnail } from "@/components/post/PostThumbnail";
import { PostSkeleton } from "@/components/post/PostSkeleton";
import { PostError } from "@/components/post/PostError";
import { PostNavigation } from "@/components/post/PostNavigation";
import { useEffect, useState } from "react";
import { getAdjacentPosts } from "@/api/posts/getAdjacentPosts";
import { supabase } from "@/lib/supabase";
import { Post, PostTable } from "@/types/post";
import { DailyQuiz } from '@/components/quiz/DailyQuiz';

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [adjacentPosts, setAdjacentPosts] = useState<{
    previous: { title: string; slug: string } | null;
    next: { title: string; slug: string } | null;
  }>({ previous: null, next: null });

  // 페이지가 로드될 때마다 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]); // slug가 변경될 때마다 실행

  useEffect(() => {
    // 슬러그가 없거나 비어있으면 404로 이동
    if (!slug || slug.trim() === '') {
      console.error("Missing slug in URL, redirecting to 404");
      navigate('/404', { replace: true });
    }
  }, [slug, navigate]);

  useEffect(() => {
    const loadAdjacentPosts = async () => {
      if (slug) {
        try {
          const adjacent = await getAdjacentPosts(slug);
          setAdjacentPosts(adjacent);
        } catch (error) {
          console.error("Error loading adjacent posts:", error);
        }
      }
    };

    loadAdjacentPosts();
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      navigate('/404');
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data: postData, error: postError } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')  // 발행된 포스트만 조회
          .single();

        if (postError) {
          if (postError.code === 'PGRST116') {
            throw new Error('포스트를 찾을 수 없습니다');
          }
          throw postError;
        }
        
        if (!postData) {
          throw new Error('포스트를 찾을 수 없습니다');
        }

        setPost(postData);
        setError(null);
      } catch (err) {
        console.error("포스트 로딩 중 오류:", err);
        const errorMessage = err instanceof Error ? err.message : '포스트를 불러오는 중 오류가 발생했습니다';
        setError(new Error(errorMessage));
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return <PostSkeleton />;
  }

  if (error || !post) {
    return <PostError error={error} onBack={() => navigate(-1)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <article className="flex-1 bg-white dark:bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
              {post && (
                <>
                  {post.thumbnail_url && (
                    <div className="relative w-full h-[400px]">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <PostHeader 
                      title={post.title}
                      category={post.category}
                      date={post.date}
                      readTime="14 min read"
                      author="블로그 관리자"
                    />
                    <div className="mt-8">
                      <PostContent content={post.content} format={post.format || 'markdown'} />
                    </div>
                    <div className="mt-8">
                      <PostNavigation
                        previous={adjacentPosts.previous}
                        next={adjacentPosts.next}
                      />
                    </div>
                  </div>
                </>
              )}
            </article>
            
            {/* Sidebar */}
            <div className="w-full lg:w-[300px] lg:flex-shrink-0 space-y-6">
              <div className="sticky top-20">
                <DailyQuiz />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
