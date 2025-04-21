
import { supabase } from "@/integrations/supabase/client";

// Delete a post by ID
export const deletePostById = async (postId: string) => {
  try {
    console.log("Deleting post with ID:", postId);
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId) as { error: any };
    
    if (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error in deletePostById:", error);
    throw error;
  }
};

// Delete a draft post after it's been published
export const deleteDraftAfterPublish = async (slug: string) => {
  try {
    console.log(`Finding draft posts with slug '${slug}' to delete after publishing`);
    
    // 1. 해당 슬러그를 가진 draft 상태의 포스트 찾기
    const { data: drafts, error: fetchError } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'draft');
    
    if (fetchError) {
      console.error("Error finding draft posts:", fetchError);
      return; // 조용히 실패 - 이 작업은 중요하지만 실패해도 메인 기능에 영향 없음
    }
    
    // 2. 해당되는 draft가 있다면 삭제
    if (drafts && drafts.length > 0) {
      console.log(`Found ${drafts.length} draft(s) to delete for slug: ${slug}`);
      
      for (const draft of drafts) {
        await deletePostById(draft.id);
      }
    } else {
      console.log(`No drafts found with slug: ${slug}`);
    }
  } catch (error) {
    console.error("Error in deleteDraftAfterPublish:", error);
    // 이 함수는 성공적인 발행 후 호출되므로, 오류가 발생해도 사용자에게 알림이 필요 없음
  }
};
