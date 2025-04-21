export interface Post {
  id: string | null;
  title: string;
  content: string;
  slug: string;
  status: 'published' | 'draft';
  category: string;
  date: string;
  views: number;
  featured: boolean;
  thumbnailPreview: string | null;
  user_id?: string | null;
  format?: 'markdown' | 'html';
  tags?: string[];
}

export interface PreviewContent {
  title: string;
  content: string;
  category: string;
  date: string;
  thumbnailPreview: string | null;
  format?: 'markdown' | 'html' | 'plain';
}

export interface PostForm {
  id: string | null;
  title: string;
  content: string;
  category: string;
  featured: boolean;
  thumbnailPreview: string | null;
  thumbnailFile?: File | null;
  slug: string;
  status: 'draft' | 'published';
  date: string;
  views: number;
  format: 'markdown' | 'html' | 'plain';
}

export interface PostFormData {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
  category: string;
  date: string;
  views: number;
  featured: boolean;
  thumbnailPreview: string | null;
  format: 'markdown' | 'html' | 'plain';
  user_id?: string | null;
}
