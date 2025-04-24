import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface RecentPost {
  id: string;
  title: string;
  category: string;
  date: string;
  slug: string;
  content: string;
  thumbnailUrl?: string | null;
}

// HTML 태그 제거 함수
const stripTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
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
  const wordsPerMinute = 200; // 평균 읽기 속도
  return Math.ceil(words / wordsPerMinute);
};

async function fetchRecentPosts(): Promise<RecentPost[]> {
  // 7일 전 날짜 계산
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString();

  const { data, error } = await supabase
    .from('posts')
    .select('id, title, content, category, date, slug, thumbnail_url')
    .eq('status', 'published')
    .gte('date', sevenDaysAgoStr)  // 7일 전 이후의 글만 선택
    .order('date', { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching recent posts:", error);
    throw error;
  }

  return (data || []).map(post => ({
    ...post,
    date: new Date(post.date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    thumbnailUrl: post.thumbnail_url
  }));
}

export function RecentPosts() {
  const { data: posts, isLoading, error } = useQuery<RecentPost[]>({
    queryKey: ['recentPosts'],
    queryFn: fetchRecentPosts,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  if (error) {
    console.error("Error in RecentPosts:", error);
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">최근 7일</h2>
          <Link 
            to="/category/all" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            모든 글 보기
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // 로딩 상태 UI
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="bg-card/50 border shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="w-full h-48 rounded-md" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !posts || posts.length === 0 ? (
            // 데이터가 없을 때 UI
            <div className="col-span-full text-center py-4 text-muted-foreground">
              아직 게시글이 없습니다.
            </div>
          ) : (
            // 게시글 목록 UI
            posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:bg-muted/50 dark:hover:bg-slate-850">
                  <CardContent className="p-4 space-y-3">
                    {post.thumbnailUrl ? (
                      <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                        <img 
                          src={post.thumbnailUrl} 
                          alt={post.title}
                          className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        />
                      </AspectRatio>
                    ) : (
                      <AspectRatio ratio={4/3} className="bg-muted rounded-md">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      </AspectRatio>
                    )}
                    <Badge variant="secondary" className="bg-transparent text-muted-foreground hover:bg-transparent">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {createExcerpt(post.content, 150)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                      <span>{post.date}</span>
                      <span>{calculateReadingTime(post.content)} min read</span>
                    </div>
                    {post.id === posts[0].id && (
                      <Badge variant="secondary" className="bg-transparent border-primary text-primary mt-2">
                        NEW
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
