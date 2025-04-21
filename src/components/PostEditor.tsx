import * as React from "react";
import { Post } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { usePostForm } from "@/hooks/usePostForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost } from "@/api/posts/postActions";
import DOMPurify from "isomorphic-dompurify";

// Import components
import { TitleField } from "@/components/editor/TitleField";
import { SlugField } from "@/components/editor/SlugField";
import { CategorySelector } from "@/components/editor/CategorySelector";
import { ThumbnailUploader } from "@/components/editor/ThumbnailUploader";
import { FeaturedToggle } from "@/components/editor/FeaturedToggle";
import { ContentEditor } from "@/components/editor/ContentEditor";
import { PreviewButton } from "@/components/editor/PreviewButton";
import { ImageUploadDialog } from "@/components/editor/ImageUploadDialog";
import { categories, getCategoryName } from "@/components/editor/editorUtils";
import { CategorySelect } from "@/components/editor/CategorySelect";
import { TagInput } from "@/components/editor/TagInput";

interface PostFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  format: 'plain' | 'markdown' | 'html';
  slug: string;
  featured: boolean;
  thumbnailPreview: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
}

// DOMPurify 설정
const DOMPURIFY_CONFIG = {
  ADD_TAGS: [
    'iframe',
    'video',
    'audio',
    'source',
    'track',
    'figure',
    'figcaption',
    'picture',
    'time',
  ],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'frameborder',
    'scrolling',
    'target',
    'rel',
    'controls',
    'poster',
    'preload',
    'autoplay',
    'muted',
    'loop',
    'playsinline',
    'loading',
    'datetime',
  ],
  FORBID_TAGS: ['script', 'style', 'form', 'input', 'textarea', 'select', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  ALLOW_DATA_ATTR: true,
  USE_PROFILES: {
    html: true,
    svg: true,
    svgFilters: true,
  },
};

interface PostEditorProps {
  initialPost?: Post | null;
  onPreviewClick?: (previewData: {
    title: string;
    content: string;
    category: string;
    date: string;
    thumbnailPreview?: string | null;
    format?: string;
  }) => void;
  onFormChange?: (formData: any) => void;
  resetForm?: boolean;
}

export const PostEditor: React.FC<PostEditorProps> = ({ 
  initialPost, 
  onPreviewClick,
  onFormChange,
  resetForm = false
}) => {
  const {
    title,
    content,
    category,
    featured,
    slug,
    thumbnailPreview,
    autoGenerateSlug,
    format,
    imageDialogOpen,
    setImageDialogOpen,
    handleTitleChange,
    handleSlugChange,
    regenerateSlug,
    setAutoGenerateSlug,
    setCategory,
    setFeatured,
    setContent,
    setFormat,
    handleThumbnailChange,
    handleImageDialogOpen,
    handleImageInsert,
    getFormData,
    setTags,
    tags
  } = usePostForm(initialPost, resetForm);

  const { toast } = useToast();
  const navigate = useNavigate();

  // 폼 데이터가 변경될 때마다 부모 컴포넌트에 알림
  React.useEffect(() => {
    if (onFormChange) {
      const formData = getFormData();
      console.log("Form changed, thumbnail preview:", formData.thumbnailPreview);
      onFormChange(formData);
    }
  }, [title, content, category, featured, thumbnailPreview, slug, format]);

  const handlePreview = () => {
    if (onPreviewClick) {
      onPreviewClick({
        title: title || "새 포스트 제목",
        content: content || "포스트 내용이 여기에 표시됩니다.",
        category: getCategoryName(category),
        date: new Date().toLocaleDateString("ko-KR", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        thumbnailPreview: thumbnailPreview,
        format
      });
    }
  };

  return (
    <form className="space-y-6">
      <div>
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="포스트 제목을 입력하세요..."
        />
      </div>

      <SlugField 
        slug={slug}
        autoGenerate={autoGenerateSlug}
        onChange={handleSlugChange}
        onAutoGenerateChange={setAutoGenerateSlug}
        regenerateSlug={regenerateSlug}
        title={title}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <CategorySelect
            value={category}
            onChange={setCategory}
          />
        </div>
        <div>
          <TagInput
            tags={tags}
            onChange={setTags}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThumbnailUploader 
          thumbnailPreview={thumbnailPreview}
          onFileChange={handleThumbnailChange}
        />
      </div>

      <FeaturedToggle 
        checked={featured}
        onCheckedChange={setFeatured}
      />

      <ContentEditor 
        content={content}
        onChange={setContent}
        format={format}
        onFormatChange={(newFormat) => {
          if (newFormat !== 'plain') {
            setFormat(newFormat);
          }
        }}
        onImageUpload={handleImageDialogOpen}
      />

      <PreviewButton onClick={handlePreview} />
      
      <ImageUploadDialog 
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onImageInsert={handleImageInsert}
        format={format === 'plain' ? 'markdown' : format}
      />
    </form>
  );
};
