
import { useState } from 'react';
import { Post, PostForm } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export const usePostEditor = () => {
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  
  const editPost = (post: Post) => {
    // 포스트 콘텐츠 분석하여 포맷 추정
    let format: 'markdown' | 'html' = 'markdown';
    if (post.content?.startsWith('<')) {
      format = 'html';
    } else {
      format = 'markdown'; // 기본값은 markdown으로 설정
    }
    
    // Deep copy all post properties to ensure all content is available for editing
    setEditingPost({
      ...post,
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      featured: post.featured,
      thumbnailPreview: post.thumbnailPreview,
      slug: post.slug,
      status: post.status,
      date: post.date,
      views: post.views,
      format // 추정한 포맷 추가
    });
    
    toast({
      title: "수정 모드",
      description: `포스트 수정: ${post.title}`,
    });
  };
  
  const clearEditingPost = () => {
    setEditingPost(null);
  };
  
  // 포스트 폼 초기화 (신규 또는 기존)
  const getInitialPostForm = (): PostForm => {
    if (editingPost) {
      return {
        id: editingPost.id,
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category,
        featured: editingPost.featured,
        thumbnailPreview: editingPost.thumbnailPreview,
        slug: editingPost.slug,
        status: editingPost.status,
        date: editingPost.date,
        views: editingPost.views,
        format: editingPost.format || 'markdown' // format은 필수 항목이므로 기본값 설정
      };
    } else {
      return {
        id: null,
        title: '',
        content: '',
        category: '',
        featured: false,
        thumbnailPreview: null,
        slug: '',
        status: 'draft',
        date: new Date().toISOString().split('T')[0],
        views: 0,
        format: 'markdown'
      };
    }
  };
  
  return {
    editingPost,
    setEditingPost,
    editPost,
    clearEditingPost,
    getInitialPostForm
  };
};
