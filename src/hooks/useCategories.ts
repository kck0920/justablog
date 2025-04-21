// 카테고리 ID에 따른 제목을 반환하는 훅
export const getCategoryTitle = (id: string) => {
  const titles: Record<string, string> = {
    all: "모든 글",
    ai: "AI",
    health: "건강",
    finance: "재테크",
    lifestyle: "라이프스타일",
    news: "뉴스",
    knowledge: "일반상식",
    issues: "이슈",
    featured: "인기 글"
  };
  return titles[id] || id;
};
