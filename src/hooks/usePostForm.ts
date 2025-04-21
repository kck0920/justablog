import * as React from "react";
import { Post } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { generateSlug } from "@/utils/postUtils";
import { useState, useCallback } from 'react';

export const usePostForm = (initialPost?: Post | null, resetForm: boolean = false) => {
  const [title, setTitle] = React.useState(initialPost?.title || "");
  const [content, setContent] = React.useState(initialPost?.content || "");
  const [category, setCategory] = React.useState(initialPost?.category || "");
  const [featured, setFeatured] = React.useState(initialPost?.featured || false);
  const [slug, setSlug] = React.useState(initialPost?.slug || "");
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState(initialPost?.thumbnailPreview || '');
  const [autoGenerateSlug, setAutoGenerateSlug] = React.useState(!initialPost?.slug);
  const [format, setFormat] = React.useState<'plain' | 'markdown' | 'html'>(
    initialPost?.format || 'plain'
  );
  
  // 이미지 삽입 관련 상태
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  
  const { toast } = useToast();

  const [tags, setTags] = useState<string[]>([]);

  // 초기 포스트가 변경될 때마다 상태 업데이트
  React.useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title || "");
      setContent(initialPost.content || "");
      setCategory(initialPost.category || "");
      setFeatured(initialPost.featured || false);
      setThumbnailPreview(initialPost.thumbnailPreview || null);
      setSlug(initialPost.slug || "");
      setAutoGenerateSlug(!initialPost.slug);
      setThumbnail(null);
      
      // 콘텐츠 포맷 감지
      if (initialPost.format === 'html') {
        setFormat('html');
      } else {
        setFormat('markdown');
      }
      
      console.log("Setting initial post thumbnail:", initialPost.thumbnailPreview);
    } else {
      resetFormFields();
    }
  }, [initialPost]);

  // resetForm prop이 true로 변경되면 폼 초기화
  React.useEffect(() => {
    if (resetForm) {
      resetFormFields();
    }
  }, [resetForm]);

  // 폼 초기화 함수
  const resetFormFields = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setFeatured(false);
    setSlug("");
    setThumbnailPreview("");
    setAutoGenerateSlug(true);
    setFormat('plain');
    setTags([]);
  };

  // 폼 데이터 수집
  const getFormData = () => {
    // 슬러그 유효성 확인 및 자동 생성
    let validSlug = slug;
    if (!validSlug && title) {
      validSlug = generateSlug(title);
    }
    
    return {
      id: initialPost?.id || null,
      title,
      content,
      category,
      featured,
      thumbnailPreview,
      thumbnailFile: thumbnail,
      slug: validSlug,
      status: initialPost?.status || 'draft',
      date: initialPost?.date || new Date().toISOString().split('T')[0],
      views: initialPost?.views || 0,
      format,
      tags
    };
  };

  const handleThumbnailChange = (file: File | null, uploadedUrl?: string) => {
    console.log("Thumbnail changed:", file ? file.name : "null", "URL:", uploadedUrl);
    setThumbnail(file);
    
    if (file && !uploadedUrl) {
      // 로컬 미리보기 URL 생성 (파일 업로드 전)
      const reader = new FileReader();
      reader.onload = () => {
        const previewUrl = reader.result as string;
        console.log("Generated local preview URL");
        setThumbnailPreview(previewUrl);
      };
      reader.readAsDataURL(file);
    } else if (uploadedUrl) {
      // 이미 업로드된 URL 사용
      console.log("Setting uploaded URL as preview:", uploadedUrl);
      setThumbnailPreview(uploadedUrl);
    } else {
      // 파일이 null인 경우 (삭제)
      console.log("Clearing thumbnail preview");
      setThumbnailPreview(null);
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    
    // 자동 슬러그 생성이 활성화되어 있으면 제목이 변경될 때마다 슬러그를 업데이트
    if (autoGenerateSlug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setSlug(newSlug);
    // 슬러그를 수동으로 변경하면 자동 생성 기능을 비활성화
    setAutoGenerateSlug(false);
  };

  const regenerateSlug = () => {
    if (title) {
      setSlug(generateSlug(title));
      setAutoGenerateSlug(true);
    }
  };
  
  const handleImageDialogOpen = () => {
    setImageDialogOpen(true);
  };
  
  const handleImageInsert = (uploadedUrl: string) => {
    // 현재 포맷에 맞게 이미지 태그 삽입
    let imageTag = "";
    if (format === 'markdown') {
      imageTag = `![이미지](${uploadedUrl})`;
    } else if (format === 'html') {
      imageTag = `<img src="${uploadedUrl}" alt="이미지" />`;
    }
    
    // 커서 위치에 이미지 태그 삽입
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const newContent = content.substring(0, start) + imageTag + content.substring(textarea.selectionEnd);
      setContent(newContent);
    } else {
      // 텍스트에리어를 찾지 못한 경우 콘텐츠 끝에 추가
      setContent(content + "\n" + imageTag);
    }
  };

  return {
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
    tags,
    setTags,
    handleTitleChange,
    handleSlugChange,
    regenerateSlug,
    setCategory,
    setFeatured,
    setContent,
    setFormat,
    handleThumbnailChange,
    handleImageDialogOpen,
    handleImageInsert,
    setAutoGenerateSlug,
    getFormData,
    resetFormFields
  };
};
