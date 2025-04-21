import { supabase } from "@/integrations/supabase/client";
import { Post } from '@/types/admin';
import { v4 as uuidv4 } from 'uuid';
import { PostTable, convertPostTableToPost } from "./types";
import { generateSlug, generateUniqueSlug } from "@/utils/postUtils";
import { uploadImageToStorage } from "./uploadImage";

export const savePost = async (post: Post, status: 'published' | 'draft', thumbnailFile: File | null = null) => {
  try {
    console.log("Saving post to Supabase:", post.title, status);
    
    // Upload thumbnail image if provided
    let thumbnailUrl = post.thumbnailPreview;
    
    if (thumbnailFile) {
      console.log("Uploading thumbnail image to storage");
      try {
        thumbnailUrl = await uploadImageToStorage(thumbnailFile);
        console.log("Uploaded thumbnail URL:", thumbnailUrl);
      } catch (error) {
        console.error("Failed to upload thumbnail:", error);
        throw new Error("썸네일 업로드 실패");
      }
    }
    
    // Check if slug is empty or a URL and generate a valid slug if needed
    let validSlug = post.slug;
    if (!validSlug || validSlug.trim() === '' || validSlug.startsWith('http://') || validSlug.startsWith('https://')) {
      // 제목이 비어있거나 공백만 있는 경우 임시 제목 사용
      const titleForSlug = post.title?.trim() || `임시-${new Date().getTime()}`;
      validSlug = generateSlug(titleForSlug);
      
      if (!validSlug) {
        // 임시 슬러그 생성
        validSlug = `draft-${new Date().getTime()}`;
      }
      console.log("Generated new slug:", validSlug);
    }
    
    // 항상 고유한 슬러그 체크
    let finalSlug = validSlug;
    
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('slug', validSlug);
        
      if (error) throw error;
      
      if (count && count > 0) {
        if (post.id) {
          const { data: existingPost } = await supabase
            .from('posts')
            .select('id')
            .eq('slug', validSlug)
            .single();
            
          if (existingPost && existingPost.id !== post.id) {
            finalSlug = generateUniqueSlug(validSlug);
            if (!finalSlug) {
              finalSlug = `${validSlug}-${new Date().getTime()}`;
            }
            console.log("슬러그 중복 감지! 고유한 슬러그 생성:", finalSlug);
          }
        } else {
          finalSlug = generateUniqueSlug(validSlug);
          if (!finalSlug) {
            finalSlug = `${validSlug}-${new Date().getTime()}`;
          }
          console.log("슬러그 중복 감지! 고유한 슬러그 생성:", finalSlug);
        }
      }
    } catch (error) {
      console.error("슬러그 확인 중 오류 발생:", error);
      finalSlug = `${validSlug}-${new Date().getTime()}`;
      console.log("오류로 인해 새로운 슬러그 생성:", finalSlug);
    }
    
    const format = post.format || 'markdown';
    
    try {
      if (!post.id) {
        const newId = uuidv4();
        
        // Supabase에 저장할 데이터 객체 생성
        const postData = {
          id: newId,
          title: post.title || '(제목 없음)',
          content: post.content,
          slug: finalSlug,
          status: status,
          category: post.category,
          date: new Date().toISOString(),
          featured: post.featured || false,
          thumbnail_url: thumbnailUrl || null,
          user_id: null,
          format: format,
          tags: post.tags || []
        };
        
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select()
          .single() as { data: PostTable | null, error: any };
        
        if (error) {
          console.error("Error creating post in Supabase:", error);
          throw error;
        }
        
        if (!data) {
          throw new Error("포스트 생성 실패: 데이터가 없습니다");
        }
        
        const convertedPost = convertPostTableToPost(data);
        if (!convertedPost) {
          throw new Error("포스트 데이터 변환 실패");
        }
        
        return convertedPost;
      }
      else {
        // Supabase에 저장할 데이터 객체 생성
        const postData = {
          title: post.title || '(제목 없음)',
          content: post.content,
          slug: finalSlug,
          status: status,
          category: post.category,
          featured: post.featured || false,
          thumbnail_url: thumbnailUrl || null,
          updated_at: new Date().toISOString(),
          format: format,
          tags: post.tags || []
        };
        
        console.log('Prepared post data:', { ...postData, content: '(content truncated)' });
        
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id)
          .select()
          .single() as { data: PostTable | null, error: any };
        
        if (error) {
          console.error("Error updating post in Supabase:", error);
          throw error;
        }
        
        console.log('Saved post data:', { ...data, content: '(content truncated)' });
        
        if (!data) {
          throw new Error("포스트 업데이트 실패: 데이터가 없습니다");
        }
        
        const convertedPost = convertPostTableToPost(data);
        if (!convertedPost) {
          throw new Error("포스트 데이터 변환 실패");
        }
        
        return convertedPost;
      }
    } catch (error: any) {
      console.error("Supabase error:", error);
      if (error.message && error.message.includes("duplicate key value")) {
        throw new Error("중복된 슬러그입니다. 다시 시도하세요.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in savePost:", error);
    throw error;
  }
};
