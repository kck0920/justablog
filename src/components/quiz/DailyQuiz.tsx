import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChevronRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
  explanation: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export function DailyQuiz() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // 하드코딩된 카테고리 데이터 사용
    const hardcodedCategories: Category[] = [
      {
        id: 1,
        name: "스포츠",
        slug: "sports",
        icon: "⚽",
        description: "스포츠와 관련된 흥미로운 상식 퀴즈"
      },
      {
        id: 2,
        name: "건강",
        slug: "health",
        icon: "🏥",
        description: "건강과 웰빙에 관한 유용한 상식"
      },
      {
        id: 3,
        name: "과학",
        slug: "science",
        icon: "🔬",
        description: "과학의 신비로운 세계를 탐험하는 퀴즈"
      },
      {
        id: 4,
        name: "역사",
        slug: "history",
        icon: "📚",
        description: "세계사와 한국사에 관한 흥미진진한 퀴즈"
      },
      {
        id: 5,
        name: "문화",
        slug: "culture",
        icon: "🎭",
        description: "다양한 문화와 예술에 관한 상식"
      }
    ];
    setCategories(hardcodedCategories);
  }, []);

  const fetchQuestions = async (categoryId: number) => {
    // 임시로 하드코딩된 질문 사용
    const hardcodedQuestions: Question[] = [
      {
        id: 1,
        question: "올림픽 오륜기의 다섯 가지 색상 중 노란색 링은 어느 대륙을 상징할까요?",
        correct_answer: "아시아",
        wrong_answers: ["유럽", "아메리카", "아프리카"],
        explanation: "올림픽 오륜기의 색상은 각각 파랑(유럽), 노랑(아시아), 검정(아프리카), 초록(오세아니아), 빨강(아메리카)을 상징합니다."
      }
    ];
    setQuestions(hardcodedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResult(false);
  };

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category);
    await fetchQuestions(category.id);
    setIsDialogOpen(true);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (newAnswers.length === questions.length) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correct_answer ? 1 : 0);
    }, 0);
  };

  const getCurrentQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;

    const answers = [...question.wrong_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5);

    return { ...question, answers };
  };

  const resetQuiz = () => {
    setShowResult(false);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Link to="/quiz" className="block">
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/15 dark:to-primary/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group hover:scale-[1.02] border border-primary/10 hover:border-primary/20">
        <div className="mb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors">
              오늘의 상식 퀴즈
            </h2>
          </div>
          <div>
            <p className="text-base font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse leading-relaxed">
              당신의 상식이 궁금하다면...<br />
              <span className="block text-lg font-semibold mt-2">✨ 클릭 ✨</span>
              <span className="block text-sm mt-1">🎯 도전해보세요 🎮</span>
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-4">
          {categories.slice(0, 5).map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center gap-1 p-2 rounded-lg bg-background/50 group-hover:bg-background/80 transition-colors"
            >
              <span className="text-2xl">{category.icon}</span>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory?.icon} {selectedCategory?.name} 퀴즈
            </DialogTitle>
            <DialogDescription>
              {showResult ? (
                <div className="text-center py-4">
                  <h3 className="text-2xl font-bold mb-2">
                    퀴즈 결과 {calculateScore()}/5
                  </h3>
                  <p className="mb-4">
                    {calculateScore() === 5 && '🎉 완벽해요! 대단해요!'}
                    {calculateScore() === 4 && '👏 거의 완벽해요!'}
                    {calculateScore() === 3 && '😊 잘 하셨어요!'}
                    {calculateScore() === 2 && '🤔 다음에는 더 잘할 수 있어요!'}
                    {calculateScore() <= 1 && '📚 더 공부해볼까요?'}
                  </p>
                  <Button onClick={resetQuiz}>다시 도전하기</Button>
                </div>
              ) : (
                <div className="py-4">
                  {getCurrentQuestion() && (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline">
                          {currentQuestionIndex + 1}/5
                        </Badge>
                      </div>
                      <p className="text-lg mb-4">
                        {getCurrentQuestion()?.question}
                      </p>
                      <div className="grid gap-2">
                        {getCurrentQuestion()?.answers.map((answer) => (
                          <Button
                            key={answer}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleAnswer(answer)}
                          >
                            {answer}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Link>
  );
} 