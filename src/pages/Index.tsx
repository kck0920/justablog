import { HeroSection } from "@/components/HeroSection";
import { MainFeaturedPosts } from "@/components/MainFeaturedPosts";
import { RecentPosts } from "@/components/RecentPosts";
import { CategorySection } from "@/components/CategorySection";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <div className="bg-background relative z-0">
        {/* 최신 글 섹션 */}
        <div className="bg-white dark:bg-zinc-900">
          <Separator />
          <RecentPosts />
        </div>
        
        {/* 추천 글 섹션 */}
        <div className="bg-muted/30">
          <Separator />
          <MainFeaturedPosts />
        </div>
        
        {/* 카테고리 섹션 */}
        <div className="bg-white dark:bg-zinc-900">
          <Separator />
          <CategorySection />
        </div>
      </div>
    </div>
  );
};

export default Index;
