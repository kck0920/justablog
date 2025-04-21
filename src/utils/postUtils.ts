
import { Post } from '@/types/admin';

// URL 슬러그 생성 함수
export const generateSlug = (title: string): string => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-가-힣]/g, '')  // 특수문자 제거 (한글 포함)
    .replace(/\s+/g, '-')      // 공백을 하이픈으로 변환
    .replace(/--+/g, '-')      // 중복 하이픈 제거
    .replace(/[가-힣]/g, (match) => {
      // 한글을 로마자로 간단하게 변환 (완벽한 변환은 아님)
      const koreanToEnglish: {[key: string]: string} = {
        '가': 'ga', '나': 'na', '다': 'da', '라': 'ra', '마': 'ma', '바': 'ba', 
        '사': 'sa', '아': 'a', '자': 'ja', '차': 'cha', '카': 'ka', '타': 'ta', 
        '파': 'pa', '하': 'ha', '야': 'ya', '어': 'eo', '여': 'yeo', '오': 'o',
        '요': 'yo', '우': 'u', '유': 'yu', '으': 'eu', '이': 'i', '워': 'wo',
        '웨': 'we', '위': 'wi', '와': 'wa'
      };
      
      // 기본값으로는 그냥 빈 문자열 반환
      return koreanToEnglish[match] || '';
    })
    .replace(/--+/g, '-')      // 변환 후 중복 하이픈 다시 제거
    .replace(/^-+|-+$/g, '');  // 시작과 끝의 하이픈 제거
};

// 고유한 슬러그 생성 (중복 방지)
export const generateUniqueSlug = (baseSlug: string): string => {
  // 현재 타임스탬프를 사용하여 고유한 슬러그 생성
  const timestamp = new Date().getTime().toString().slice(-6);
  return `${baseSlug}-${timestamp}`;
};

// Format posts received from the API
export const formatPosts = (apiPosts: any[]): Post[] => {
  return apiPosts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    category: post.category,
    date: new Date(post.date).toISOString().split('T')[0],
    views: post.views,
    featured: post.featured,
    thumbnailPreview: post.thumbnail_url,
    content: post.content,
    format: post.format || 'markdown' // format 필드 추가
  }));
};

// Update posts array with a new or updated post
export const updatePostsArray = (posts: Post[], updatedPost: Post): Post[] => {
  const existingPostIndex = posts.findIndex(p => p.id === updatedPost.id);
  
  if (existingPostIndex >= 0) {
    // Update existing post
    return [
      ...posts.slice(0, existingPostIndex),
      updatedPost,
      ...posts.slice(existingPostIndex + 1)
    ];
  } else {
    // Add new post to beginning
    return [updatedPost, ...posts];
  }
};

// Filter out deleted post from posts array
export const filterDeletedPost = (posts: Post[], deletedPostId: string): Post[] => {
  return posts.filter(post => post.id !== deletedPostId);
};
