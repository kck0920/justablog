
import { useState } from 'react';
import { Post, PreviewContent } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const usePostPreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<PreviewContent | null>(null);
  const { toast } = useToast();
  
  const openPreview = (data: PreviewContent) => {
    // 형식이 지정되지 않은 경우 기본값을 마크다운으로 설정
    const format = data.format || 'markdown';
    
    setPreviewContent({
      ...data,
      format
    });
    setPreviewOpen(true);
    
    toast({
      title: "미리보기 열림",
      description: "포스트 미리보기가 열렸습니다.",
    });
  };
  
  const openPostPreview = (post: Post) => {
    const categoryName = post.category;
    // 포맷이 지정되지 않은 경우 기본값을 마크다운으로 설정
    const format = post.format || 'markdown';
    
    setPreviewContent({
      title: post.title,
      content: post.content,
      category: categoryName,
      date: post.date,
      thumbnailPreview: post.thumbnailPreview,
      format
    });
    setPreviewOpen(true);
    
    toast({
      title: "미리보기 열림",
      description: `"${post.title}" 포스트 미리보기가 열렸습니다.`,
    });
  };
  
  return {
    previewOpen,
    setPreviewOpen,
    previewContent,
    openPreview,
    openPostPreview
  };
};
