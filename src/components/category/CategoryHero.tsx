import { motion, AnimatePresence } from "framer-motion";

type CategoryHeroProps = {
  category: string;
};

const categoryInfo = {
  ai: {
    title: "인공지능과 미래 기술",
    description: "AI가 만들어가는 새로운 세상, 그 놀라운 혁신과 발전을 함께 살펴봅니다.",
    gradient: "from-blue-600 to-purple-600",
  },
  health: {
    title: "건강과 웰빙",
    description: "당신의 건강한 삶을 위한 전문적인 조언과 실천 가능한 팁을 제공합니다.",
    gradient: "from-green-600 to-emerald-600",
  },
  finance: {
    title: "재테크",
    description: "현명한 자산 관리와 투자 전략으로 당신의 재무적 자유를 실현하세요.",
    gradient: "from-yellow-600 to-orange-600",
  },
  lifestyle: {
    title: "라이프스타일",
    description: "일상의 특별한 순간들을 더욱 풍요롭게 만드는 라이프스타일 팁을 소개합니다.",
    gradient: "from-pink-600 to-rose-600",
  },
  news: {
    title: "뉴스",
    description: "세상의 중요한 소식들을 빠르고 정확하게 전달해드립니다.",
    gradient: "from-sky-600 to-blue-600",
  },
  knowledge: {
    title: "일반상식",
    description: "알아두면 유용한 지식들을 쉽고 재미있게 전달해드립니다.",
    gradient: "from-indigo-600 to-violet-600",
  },
  issues: {
    title: "이슈",
    description: "주목할 만한 이슈들을 심층적으로 분석하고 다양한 관점에서 살펴봅니다.",
    gradient: "from-red-600 to-orange-600",
  }
};

export function CategoryHero({ category }: CategoryHeroProps) {
  const info = categoryInfo[category as keyof typeof categoryInfo] || {
    title: "전체 글",
    description: "모든 카테고리의 글들을 한눈에 살펴보세요.",
    gradient: "from-gray-600 to-slate-600",
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden z-10 bg-background">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,var(--tw-gradient-from)_0%,transparent_100%)] from-primary/5 dark:from-primary/10"
      />
      <div className="relative container-custom flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${category}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                {info.title}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-muted-foreground dark:text-white/80"
            >
              {info.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
} 