import React, { useState } from "react";
import { uploadImageToStorage } from "@/api/posts/uploadImage";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageInsert: (url: string) => void;
  format: 'markdown' | 'html';
}

export const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({
  open,
  onOpenChange,
  onImageInsert,
  format
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast({
        title: "이미지를 선택해주세요",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      console.log("Starting upload for:", imageFile.name);
      const uploadedUrl = await uploadImageToStorage(imageFile);
      console.log("Upload completed, URL:", uploadedUrl);
      
      if (!uploadedUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
      
      // 이미지 URL과 대체 텍스트를 상위 컴포넌트로 전달
      onImageInsert(uploadedUrl);
      
      toast({
        title: "이미지 업로드 성공",
        description: "이미지가 성공적으로 삽입되었습니다.",
      });
      
      // 다이얼로그 닫기 및 상태 초기화
      onOpenChange(false);
      setImageFile(null);
      setImageAlt("");
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "이미지 업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>이미지 업로드</DialogTitle>
          <DialogDescription>
            포스트에 삽입할 이미지를 업로드해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              이미지
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alt" className="text-right">
              대체 텍스트
            </Label>
            <Input
              id="alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="이미지 설명 (옵션)"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={handleImageUpload} disabled={!imageFile || isUploading}>
            {isUploading ? "업로드 중..." : "이미지 삽입"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
