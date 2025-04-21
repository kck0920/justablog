import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PostEditor } from "@/components/PostEditor";
import { Post } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EditorSectionProps {
  editingPost: Post | null;
  onSaveDraft: (post: Post, thumbnailFile: File | null) => Promise<any>;
  onPublish: (post: Post, thumbnailFile: File | null) => Promise<any>;
  onPreview: (data: {
    title: string;
    content: string;
    category: string;
    date: string;
    thumbnailPreview?: string | null;
    format?: string;
  }) => void;
}

export const EditorSection: React.FC<EditorSectionProps> = ({ 
  editingPost, 
  onSaveDraft, 
  onPublish, 
  onPreview 
}) => {
  const [formData, setFormData] = useState<Post | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (editingPost) {
      setFormData(editingPost);
      setShouldReset(false);
      setThumbnailFile(null);
    } else {
      setFormData(null);
    }
  }, [editingPost]);

  const handleFormChange = (data: Post & { thumbnailFile?: File | null }) => {
    setFormData(data);
    if (data.thumbnailFile) {
      setThumbnailFile(data.thumbnailFile);
    }
    if (shouldReset) {
      setShouldReset(false);
    }
  };

  const validateRequiredFields = (post: Post, isPublishing: boolean = false) => {
    const errors: string[] = [];

    if (!post.title?.trim()) {
      errors.push("제목을 입력해주세요");
    }
    
    if (isPublishing) {
      if (!post.content?.trim()) {
        errors.push("내용을 입력해주세요");
      }
      if (!post.category) {
        errors.push("카테고리를 선택해주세요");
      }
    }

    return errors;
  };

  const handleSaveDraft = async () => {
    if (formData) {
      const errors = validateRequiredFields(formData);
      if (errors.length > 0) {
        toast({
          title: "필수 항목 미입력",
          description: errors.join('\n'),
          variant: "destructive",
        });
        return;
      }

      setIsSaving(true);
      try {
        await onSaveDraft(formData, thumbnailFile);
        toast({
          title: "임시저장 완료",
          description: "포스트가 성공적으로 저장되었습니다.",
        });
      } catch (error: any) {
        toast({
          title: "저장 실패",
          description: error?.message || "저장 중 오류가 발생했습니다",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePublish = async () => {
    if (formData) {
      const errors = validateRequiredFields(formData, true);
      if (errors.length > 0) {
        toast({
          title: "필수 항목 미입력",
          description: errors.join('\n'),
          variant: "destructive",
        });
        return;
      }

      setIsPublishing(true);
      try {
        const publishedPost = await onPublish(formData, thumbnailFile);
        toast({
          title: "발행 완료",
          description: "포스트가 성공적으로 발행되었습니다.",
        });
        setShouldReset(true);
        setThumbnailFile(null);
        
        if (publishedPost?.slug) {
          navigate(`/post/${publishedPost.slug}`);
        } else {
          navigate("/admin");
        }
      } catch (error: any) {
        console.error("Publish error:", error);
        toast({
          title: "발행 실패",
          description: error?.message || "발행 중 오류가 발생했습니다",
          variant: "destructive",
        });
      } finally {
        setIsPublishing(false);
      }
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {editingPost ? `포스트 수정: ${editingPost.title}` : '새 포스트 작성'}
        </h2>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleSaveDraft}
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
          >
            {isPublishing ? '발행 중...' : '발행하기'}
          </Button>
        </div>
      </div>
      
      <PostEditor 
        initialPost={editingPost}
        onPreviewClick={onPreview}
        onFormChange={handleFormChange}
        resetForm={shouldReset}
      />
    </div>
  );
};
