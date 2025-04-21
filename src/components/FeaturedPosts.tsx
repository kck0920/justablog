import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedPost {
  id: string;
  title: string;
  category: string;
  date: string;
  slug: string;
  content: string;
  views: number;
}

// 텍스트만 추출하는 함수 (HTML과 마크다운 태그 제거)
const stripTags = (htmlOrMd: string): string => {
  const withoutHtml = htmlOrMd.replace(/<[^>]*>|<\/[^>]*>/g, ' ');
  const withoutMd = withoutHtml
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`]+/g, '')
    .replace(/\n/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ');
  return withoutMd.trim();
};

// 발췌문 생성 함수
const createExcerpt = (content: string, maxLength = 100): string => {
  const plainText = stripTags(content);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};

// 읽기 시간 계산 함수
const calculateReadingTime = (content: string): number => {
  const words = stripTags(content).split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(words / wordsPerMinute);
};

async function fetchFeaturedPosts(): Promise<FeaturedPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, category, date, slug, views')
    .eq('status', 'published')
    .eq('featured', true)
    .order('date', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching featured posts:", error);
    throw error;
  }

  return (data || []).map(post => ({
    ...post,
    date: new Date(post.date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }));
}

export function FeaturedPosts() {
  const { data: posts, isLoading, error } = useQuery<FeaturedPost[]>({
    queryKey: ['featuredPosts'],
    queryFn: fetchFeaturedPosts,
    staleTime: 1000 * 60 * 5,
  });

  if (error) {
    console.error("Error in FeaturedPosts:", error);
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">추천 글</h2>
        <Link 
          to="/category/all" 
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          모든 글 보기
        </Link>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          // 로딩 상태 UI
          Array(5).fill(0).map((_, i) => (
            <Card key={i} className="bg-card/50 border shadow-sm">
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : posts?.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            추천 글이 없습니다.
          </div>
        ) : (
          posts?.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.slug}`}
              className="block"
            >
              <Card className="overflow-hidden transition-all hover:shadow-md hover:bg-muted/50">
                <CardContent className="p-4 space-y-2">
                  <Badge variant="secondary" className="bg-transparent text-muted-foreground hover:bg-transparent">
                    {post.category}
                  </Badge>
                  <h3 className="text-base font-semibold line-clamp-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{calculateReadingTime(post.content)} min read</span>
                    <span>조회수 {post.views}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
