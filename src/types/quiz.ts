export interface Quiz {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  color: string;
  iconName: string;
  totalQuizzes: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface QuizSet {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  difficulty: string;
  quizIds: string[];
  totalQuestions: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuizProgress {
  userId: string;
  categoryId: string;
  totalAttempts: number;
  correctAnswers: number;
  lastAttemptedAt: string;
  completedQuizSets: string[];
} 