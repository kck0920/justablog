
import { useState } from 'react';

export const useTabs = (initialTab: string) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const tabs = [
    { id: "posts", label: "포스트 관리" },
    { id: "editor", label: "새 포스트" },
  ];
  
  return {
    activeTab,
    setActiveTab,
    tabs
  };
};
