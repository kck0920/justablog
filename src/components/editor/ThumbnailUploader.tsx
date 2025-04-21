import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { uploadImageToStorage, deleteImageFromStorage } from "@/api/posts/uploadImage";
import { useToast } from "@/hooks/use-toast";

interface ThumbnailUploaderProps {
  thumbnailPreview: string | null;
  onFileChange: (file: File | null, uploadedUrl?: string) => void;
}

export const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  thumbnailPreview,
  onFileChange
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // 이미지 로드 상태 초기화
  React.useEffect(() => {
    if (thumbnailPreview) {
      setImageLoadFailed(false);
    }
  }, [thumbnailPreview]);

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setIsUploading(true);
      setError(null);
      setImageLoadFailed(false);
      
      try {
        // Supabase Storage에 파일 업로드
        console.log("Starting upload for:", file.name);
        const uploadedUrl = await uploadImageToStorage(file);
        
        console.log("Upload completed, URL:", uploadedUrl);
        if (!uploadedUrl) {
          throw new Error("업로드 후 URL을 가져오지 못했습니다");
        }
        
        // 파일 및 업로드된 URL을 부모 컴포넌트에 전달
        onFileChange(file, uploadedUrl);
        
        toast({
          title: "이미지 업로드 성공",
          description: "썸네일 이미지가 업로드되었습니다.",
        });
      } catch (err: any) {
        console.error("Error handling thumbnail:", err);
        setError(err.message || "이미지 업로드 중 오류가 발생했습니다.");
        setImageLoadFailed(true);
        
        toast({
          title: "이미지 업로드 실패",
          description: err.message || "썸네일 이미지 업로드에 실패했습니다.",
          variant: "destructive",
        });
        
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } finally {
        setIsUploading(false);
      }
    } else {
      // 파일 선택이 취소된 경우
      console.log("No file selected");
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    // 이미지 제거를 위해 null 전달
    onFileChange(null);
    
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setError(null);
    setImageLoadFailed(false);
    
    toast({
      title: "이미지 제거됨",
      description: "썸네일 이미지가 제거되었습니다.",
    });
  };

  // 기본 플레이스홀더 이미지 URL
  const DEFAULT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Cpath d='M30,40 L70,40 L70,70 L30,70 Z' stroke='%23aaa' fill='none'/%3E%3Cpath d='M40,50 L50,60 L60,50' stroke='%23aaa' fill='none'/%3E%3Ccircle cx='50' cy='35' r='5' fill='%23aaa'/%3E%3C/svg%3E";

  // 이미지 로드 오류 처리
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", thumbnailPreview);
    setImageLoadFailed(true);
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

  const handleDelete = async () => {
    if (thumbnailPreview) {
      const deleted = await deleteImageFromStorage(thumbnailPreview);
      if (deleted) {
        onFileChange(null);
        setImageLoadFailed(false);
        toast({
          title: "이미지 제거됨",
          description: "썸네일 이미지가 제거되었습니다.",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="thumbnail">썸네일 이미지</Label>
        {thumbnailPreview && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            삭제
          </Button>
        )}
      </div>
      <Input
        id="thumbnail"
        type="file"
        accept="image/*"
        onChange={handleThumbnailChange}
        disabled={isUploading}
        ref={fileInputRef}
      />
      
      {error && (
        <div className="text-sm text-red-500 mt-1">{error}</div>
      )}
      
      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>이미지 업로드 중...</span>
        </div>
      )}
      
      {thumbnailPreview && (
        <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-border">
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="object-cover w-full h-full"
            onError={handleImageError}
            crossOrigin="anonymous" // CORS 문제 해결
          />
          
          {imageLoadFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-xs text-muted-foreground p-1 text-center">
              이미지 로드 실패
            </div>
          )}
          
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full"
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">이미지 삭제</span>
          </Button>
        </div>
      )}
    </div>
  );
};
