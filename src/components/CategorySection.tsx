import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  { name: "AI", href: "/category/ai", description: "인공지능과 미래 기술" },
  { name: "건강", href: "/category/health", description: "건강과 웰빙" },
  { name: "재테크", href: "/category/finance", description: "현명한 자산 관리" },
  { name: "라이프스타일", href: "/category/lifestyle", description: "더 나은 삶을 위한 팁" },
  { name: "뉴스", href: "/category/news", description: "세상의 소식" },
  { name: "일반상식", href: "/category/knowledge", description: "알아두면 유용한 지식" },
  { name: "이슈", href: "/category/issues", description: "주목할 만한 이슈들" },
];

export function CategorySection() {
  const handleCategoryClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 md:py-16 bg-muted/50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold tracking-tight mb-8">카테고리</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Button 
              key={category.name} 
              variant="outline" 
              className="h-auto flex flex-col items-start p-4 justify-start hover:bg-accent hover:text-accent-foreground transition-colors"
              asChild
              onClick={handleCategoryClick}
            >
              <Link to={category.href}>
                <div className="font-medium text-lg mb-1">{category.name}</div>
                <div className="text-sm text-muted-foreground text-start">{category.description}</div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
