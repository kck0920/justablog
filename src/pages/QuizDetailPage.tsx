import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import historyQuizzes from '@/data/quizzes/history.json';
import aiQuizzes from '@/data/quizzes/ai.json';
import sportsQuizzes from '@/data/quizzes/sports.json';
import healthQuizzes from '@/data/quizzes/health.json';
import scienceQuizzes from '@/data/quizzes/science.json';
import cultureQuizzes from '@/data/quizzes/culture.json';

interface QuizQuestion {
  id: string;
  subcategory: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tags: string[];
}

interface QuizData {
  category: string;
  quizzes: QuizQuestion[];
}

export const QuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // quizId는 "category-number" 형식입니다 (예: "history-1")
    const category = quizId?.split('-')[0];
    
    // 카테고리에 따라 해당하는 퀴즈 데이터를 불러옵니다
    let quizData: QuizData | null = null;
    switch (category) {
      case 'ai':
        quizData = aiQuizzes;
        break;
      case 'history':
        quizData = historyQuizzes;
        break;
      case 'sports':
        quizData = sportsQuizzes;
        break;
      case 'health':
        quizData = healthQuizzes;
        break;
      case 'science':
        quizData = scienceQuizzes;
        break;
      case 'culture':
        quizData = cultureQuizzes;
        break;
      default:
        navigate('/quiz');
        return;
    }

    if (quizData) {
      // 퀴즈 5개를 랜덤으로 선택합니다
      const randomQuizzes = [...quizData.quizzes]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      setQuizzes(randomQuizzes);
    }
  }, [quizId, navigate, toast]);

  const handleAnswerSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      toast({
        title: "답을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    const isCorrect = selectedAnswer === quizzes[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setAnsweredQuestions(prev => prev + 1);
    setIsAnswered(true);

    // 잠시 후 다음 문제로 이동
    setTimeout(() => {
      if (currentQuestionIndex < quizzes.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      }
    }, 1000);
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
  };

  // 퀴즈가 로드되지 않았거나 없는 경우
  if (quizzes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentQuestionIndex];
  const isQuizComplete = answeredQuestions === quizzes.length;

  const chartData = [
    { name: '정답', value: correctAnswers, color: '#22c55e' },
    { name: '오답', value: answeredQuestions - correctAnswers, color: '#ef4444' },
    { name: '남은 문제', value: quizzes.length - answeredQuestions, color: '#e5e7eb' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8 max-w-5xl mx-auto">
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold">문제 {currentQuestionIndex + 1} / {quizzes.length}</h2>
            <div className="text-sm text-muted-foreground">
              정답: {correctAnswers}개 / 푼 문제: {answeredQuestions}개
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-6">{currentQuiz.question}</h1>
          <div className="space-y-4">
            {currentQuiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === index
                    ? isAnswered
                      ? index === currentQuiz.correctAnswer
                        ? 'bg-green-100 dark:bg-green-900 border-green-500'
                        : 'bg-red-100 dark:bg-red-900 border-red-500'
                      : 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                } border-2 ${
                  isAnswered && index === currentQuiz.correctAnswer
                    ? 'border-green-500'
                    : 'border-transparent'
                }`}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
          
          {!isQuizComplete ? (
            <Button
              onClick={handleSubmit}
              className="w-full mt-6"
              disabled={selectedAnswer === null || isAnswered}
            >
              정답 확인하기
            </Button>
          ) : (
            <Button
              onClick={handleRetry}
              className="w-full mt-6"
            >
              다시 풀기
            </Button>
          )}
        </div>

        <div className="w-[300px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">진행 상황</h2>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>정답</span>
              </div>
              <span>{correctAnswers}문제</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>오답</span>
              </div>
              <span>{answeredQuestions - correctAnswers}문제</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span>남은 문제</span>
              </div>
              <span>{quizzes.length - answeredQuestions}문제</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 