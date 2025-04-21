
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostContent } from "@/components/post/PostContent";

interface PostPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewContent: {
    title: string;
    content: string;
    category: string;
    date: string;
    thumbnailPreview: string | null;
    format?: string;
  } | null;
}

// 기본 플레이스홀더 이미지
const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,70 L30,70 Z' stroke='%23aaa' fill='none'/%3E%3Cpath d='M40,50 L50,60 L60,50' stroke='%23aaa' fill='none'/%3E%3Ccircle cx='50' cy='35' r='5' fill='%23aaa'/%3E%3C/svg%3E";

export const PostPreview: React.FC<PostPreviewProps> = ({ open, onOpenChange, previewContent }) => {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // 이미지 로드 오류 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", previewContent?.thumbnailPreview);
    setImageLoadFailed(true);
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };
  
  // 다이얼로그가 열릴 때마다 이미지 로드 상태 초기화
  React.useEffect(() => {
    if (open) {
      setImageLoadFailed(false);
    }
  }, [open]);

  // 콘텐츠 형식을 문자열에서 타입으로 변환하는 함수
  const getContentFormat = (): 'markdown' | 'html' => {
    if (!previewContent?.format || previewContent.format === 'plain') {
      return 'markdown'; // 기본값을 마크다운으로 설정
    }
    return previewContent.format as 'markdown' | 'html';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{previewContent?.title}</DialogTitle>
          <DialogDescription>
            작성 중인 포스트 미리보기
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto py-4">
          <div className="px-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Badge variant="outline">{previewContent?.category}</Badge>
              <span>•</span>
              <span>{previewContent?.date}</span>
            </div>
            
            {previewContent?.thumbnailPreview && (
              <div className="mb-6 relative w-full max-h-[300px] rounded-md overflow-hidden">
                <img
                  src={`${previewContent.thumbnailPreview}?t=${Date.now()}`} // 캐시 방지 파라미터 추가
                  alt="Thumbnail preview"
                  className="object-cover w-full"
                  onError={handleImageError}
                  crossOrigin="anonymous" // CORS 문제 완화
                />
                {imageLoadFailed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground">
                    이미지를 불러올 수 없습니다
                  </div>
                )}
              </div>
            )}
            
            <div className="prose dark:prose-invert max-w-none">
              {previewContent && (
                <PostContent 
                  content={previewContent.content} 
                  format={getContentFormat()} 
                />
              )}
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
