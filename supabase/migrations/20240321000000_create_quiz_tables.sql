-- 퀴즈 카테고리 테이블
CREATE TABLE quiz_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 퀴즈 문제 테이블
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES quiz_categories(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[] NOT NULL,
  explanation TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 사용자 퀴즈 결과 테이블
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category_id INTEGER REFERENCES quiz_categories(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 초기 카테고리 데이터 삽입
INSERT INTO quiz_categories (name, slug, icon, description) VALUES
('스포츠', 'sports', '⚽', '스포츠와 관련된 흥미로운 상식 퀴즈'),
('건강', 'health', '🏥', '건강과 웰빙에 관한 유용한 상식'),
('과학', 'science', '🔬', '과학의 신비로운 세계를 탐험하는 퀴즈'),
('역사', 'history', '📚', '세계사와 한국사에 관한 흥미진진한 퀴즈'),
('문화', 'culture', '🎭', '다양한 문화와 예술에 관한 상식'),
('기술', 'technology', '💻', 'IT와 최신 기술 트렌드 퀴즈'),
('음식', 'food', '🍳', '세계 각국의 음식과 요리 상식'),
('환경', 'environment', '🌍', '환경 보호와 지구 상식 퀴즈'),
('경제', 'economy', '💰', '경제와 금융에 관한 실용적인 상식'),
('언어', 'language', '🗣️', '세계의 언어와 한국어 관련 퀴즈');

-- 샘플 퀴즈 문제 삽입 (각 카테고리별 예시)
INSERT INTO quiz_questions (category_id, question, correct_answer, wrong_answers, explanation, difficulty) VALUES
(1, '올림픽 오륜기의 다섯 가지 색상 중 노란색 링은 어느 대륙을 상징할까요?', '아시아', ARRAY['유럽', '아메리카', '아프리카'], '올림픽 오륜기의 색상은 각각 파랑(유럽), 노랑(아시아), 검정(아프리카), 초록(오세아니아), 빨강(아메리카)을 상징합니다.', 'medium'),
(2, '성인의 평균 심장 박동수는 분당 몇 회일까요?', '60-100회', ARRAY['40-60회', '100-120회', '120-140회'], '건강한 성인의 안정 시 심장 박동수는 보통 분당 60-100회입니다.', 'easy'),
(3, '빛의 속도는 1초에 몇 km를 이동할까요?', '약 300,000km', ARRAY['약 100,000km', '약 200,000km', '약 400,000km'], '빛의 속도는 진공 상태에서 초당 약 299,792km입니다.', 'medium'); 