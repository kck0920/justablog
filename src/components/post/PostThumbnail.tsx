
import React, { useState } from "react";

const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,70 L30,70 Z' stroke='%23aaa' fill='none'/%3E%3Cpath d='M40,50 L50,60 L60,50' stroke='%23aaa' fill='none'/%3E%3Ccircle cx='50' cy='35' r='5' fill='%23aaa'/%3E%3C/svg%3E";

interface PostThumbnailProps {
  imageUrl: string | null | undefined;
  altText: string;
  onError: () => void;
}

export const PostThumbnail: React.FC<PostThumbnailProps> = ({
  imageUrl,
  altText,
  onError
}) => {
  const [localImageError, setLocalImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Post thumbnail failed to load:", imageUrl);
    setLocalImageError(true);
    onError();
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

  return (
    <div className="mb-8">
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
        <img 
          src={imageUrl || DEFAULT_PLACEHOLDER} 
          alt={altText}
          className="w-full h-full object-cover" 
          onError={handleImageError}
          loading="eager"  // Prioritize image loading
          crossOrigin="anonymous" // CORS 문제 완화
        />
        {localImageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground">
            이미지를 불러올 수 없습니다
          </div>
        )}
      </div>
    </div>
  );
};
