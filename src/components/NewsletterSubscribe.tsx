import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { subscribeToNewsletter } from '@/api/newsletter/subscribe';

export const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.newsletter-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 요소가 화면에 들어오기 시작할 때부터 효과 시작
        const visibilityStart = windowHeight; // 화면 전체 높이 기준
        const progress = (visibilityStart - rect.top) / (visibilityStart * 0.8);
        
        setScrollY(Math.max(0, Math.min(1, progress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "이메일을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // 간단한 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "유효하지 않은 이메일 형식입니다",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await subscribeToNewsletter(email);
      
      toast({
        title: "구독이 완료되었습니다",
        description: "뉴스레터 구독을 환영합니다!",
      });
      setEmail('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "구독 중 오류가 발생했습니다";
      toast({
        title: "구독 실패",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 스크롤 진행도에 따른 변환 계산
  const translateY = -200 + (scrollY * 350); // -200px 위에서 시작해서 100px까지 내려옴
  const scale = 0.9 + (scrollY * 0.1); // 더 큰 크기 변화
  const opacity = Math.min(1, scrollY * 3); // 더 빠른 페이드인

  return (
    <div className="relative z-10 h-[400px] bg-gray-50 dark:bg-gray-900 flex items-start pt-[50px] overflow-hidden">
      <div 
        className="w-full max-w-md p-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg newsletter-section mx-auto"
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out',
          willChange: 'transform, opacity',
          height: '250px'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mt-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                  뉴스레터 구독하기
                </span>
              </h2>
              <p className="text-muted-foreground">
                새로운 소식을 이메일로 받아보세요
              </p>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="space-y-2 mt-6">
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "구독 중..." : "구독하기"}
          </Button>
        </form>
      </div>
    </div>
  );
}; 