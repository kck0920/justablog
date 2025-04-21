
import { supabase } from "@/integrations/supabase/client";
import { Post } from '@/types/admin';
import { PostTable, convertPostTableToPost } from "./types";

// Increment the view count for a post
export const incrementViewCount = async (postId: string): Promise<Post> => {
  try {
    console.log("Incrementing view count for post ID:", postId);
    
    // First get the current post data
    const { data: postData, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single() as { data: PostTable | null, error: any };
    
    if (fetchError) {
      console.error("Error fetching post for view increment:", fetchError);
      throw fetchError;
    }
    
    if (!postData) {
      throw new Error("Post not found");
    }
    
    // Increment the views count and update the post
    const { data: updatedData, error: updateError } = await supabase
      .from('posts')
      .update({ views: postData.views + 1 })
      .eq('id', postId)
      .select()
      .single() as { data: PostTable | null, error: any };
    
    if (updateError) {
      console.error("Error updating view count:", updateError);
      throw updateError;
    }
    
    if (!updatedData) {
      throw new Error("Failed to update view count");
    }
    
    console.log("View count updated successfully:", updatedData.views);
    
    // Return the updated post in our app's format
    return convertPostTableToPost(updatedData);
  } catch (error) {
    console.error("Error in incrementViewCount:", error);
    throw error;
  }
};
