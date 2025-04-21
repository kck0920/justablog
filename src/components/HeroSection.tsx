import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translateY = Math.min(scrollY * 0.5, 200); // 스크롤 속도 조절 (0.5)과 최대 이동 거리 (200px) 설정

  return (
    <section className="relative py-16 md:py-24 overflow-hidden z-10 bg-background">
      <div 
        className="container-custom relative z-10"
        style={{
          transform: `translateY(-${translateY}px)`,
          transition: 'transform 0.1s linear'
        }}
      >
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
              Just A Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            AI, 건강, 재테크, 라이프스타일 등 다양한 주제에 대한 인사이트를 탐색하세요
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/category/featured">인기 글 보기</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">블로그 소개</Link>
            </Button>
          </div>
        </div>
      </div>
      <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,var(--tw-gradient-from)_0%,transparent_100%)] from-primary/5 dark:from-primary/10"
        style={{
          transform: `translateY(-${translateY * 0.3}px)`, // 배경은 더 천천히 움직이도록 설정
          transition: 'transform 0.1s linear'
        }}
      ></div>
    </section>
  );
}
