import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeaturedPost {
  id: string;
  title: string;
  category: string;
  date: string;
  slug: string;
  content: string;
  views: number;
  thumbnailUrl?: string | null;
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

// 기본 플레이스홀더 이미지
const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,70 L30,70 Z' stroke='%23aaa' fill='none'/%3E%3Cpath d='M40,50 L50,60 L60,50' stroke='%23aaa' fill='none'/%3E%3Ccircle cx='50' cy='35' r='5' fill='%23aaa'/%3E%3C/svg%3E";

export function FeaturedPosts() {
  const { data: posts, isLoading, error } = useQuery<FeaturedPost[]>({
    queryKey: ["featuredPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, category, created_at, slug, content, views, thumbnail_url")
        .eq("featured", true)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) {
        throw error;
      }

      return data.map(post => ({
        id: post.id,
        title: post.title,
        category: post.category,
        date: new Date(post.created_at).toLocaleDateString(),
        slug: post.slug,
        content: post.content,
        views: post.views,
        thumbnailUrl: post.thumbnail_url
      }));
    }
  });

  if (error) {
    console.error("Error loading featured posts:", error);
    return null;
  }

  return (
    <section className="py-8">
      <div className="container">
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          추천 포스트
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // 로딩 상태 UI
            Array(6).fill(0).map((_, i) => (
              <Card key={i} className="bg-card/50 border shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-40 w-full rounded-md" />
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
          ) : (
            posts?.map((post) => (
              <Link key={post.id} to={`/post/${post.slug}`}>
                <Card className="bg-card/50 border shadow-sm hover:shadow-md transition-all duration-200 hover:bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
                      {post.thumbnailUrl ? (
                        <img 
                          src={post.thumbnailUrl} 
                          alt={post.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            console.error("Image failed to load:", post.thumbnailUrl);
                            (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </AspectRatio>
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="font-semibold line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>조회수 {post.views}</span>
                    </div>
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
