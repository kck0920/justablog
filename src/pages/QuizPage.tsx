import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const navigate = useNavigate();

  const quizCategories = [
    {
      id: "ai",
      title: "AI",
      description: "인공지능의 기초부터 최신 트렌드까지, AI의 모든 것을 테스트해보세요. ChatGPT, 머신러닝, 딥러닝 등 다양한 주제를 다룹니다.",
      color: "text-indigo-500"
    },
    {
      id: "history",
      title: "역사",
      description: "한국과 세계의 주요 역사적 사건과 인물들에 대해 알아보세요. 재미있는 역사 이야기와 함께 지식을 쌓아보세요.",
      color: "text-yellow-500"
    },
    {
      id: "sports",
      title: "스포츠",
      description: "국내외 스포츠 경기, 선수, 기록 등 스포츠 세계의 흥미진진한 이야기를 퀴즈로 만나보세요.",
      color: "text-green-500"
    },
    {
      id: "health",
      title: "건강",
      description: "영양, 운동, 질병 예방 등 건강한 삶을 위한 필수 지식을 테스트해보세요. 일상 속 건강 관리 팁도 함께 알아봅니다.",
      color: "text-red-500"
    },
    {
      id: "science",
      title: "과학",
      description: "물리, 화학, 생물학 등 다양한 과학 분야의 흥미로운 사실들을 퀴즈로 만나보세요.",
      color: "text-blue-500"
    },
    {
      id: "culture",
      title: "문화예술",
      description: "음악, 미술, 문학 등 다양한 문화예술 분야의 지식을 재미있게 학습해보세요.",
      color: "text-purple-500"
    }
  ];

  const handleQuizStart = (categoryId: string) => {
    navigate(`/quiz/${categoryId}-1`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              오늘의 퀴즈
            </h1>
            <p className="text-muted-foreground">
              도전을 원하는 상식을 선택하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizCategories.map((category) => (
              <Card 
                key={category.id} 
                className="p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className={`h-6 w-6 ${category.color}`} />
                  <h2 className="text-2xl font-semibold">{category.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {category.description}
                </p>
                <Button 
                  className="w-full"
                  onClick={() => handleQuizStart(category.id)}
                >
                  {category.title} 퀴즈 시작하기
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 추천 글 섹션 */}
        <div className="w-full lg:w-[300px] lg:shrink-0">
          <div className="sticky top-20 mt-[4.7rem]">
            <FeaturedPosts />
          </div>
        </div>
      </div>
    </div>
  );
} 