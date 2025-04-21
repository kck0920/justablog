
import { supabase } from "@/integrations/supabase/client";
import { PostTable, convertPostTableToPost } from "./types";

// Fetch all posts from Supabase
export const fetchAllPosts = async () => {
  try {
    console.log("Fetching posts from Supabase");
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false }) as { data: PostTable[] | null, error: any };
    
    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
    
    console.log("Fetched posts data:", data);
    
    // Convert Supabase data to app format with proper type casting
    return (data || []).map(post => {
      return convertPostTableToPost(post);
    });
  } catch (error) {
    console.error("Error in fetchAllPosts:", error);
    throw error; // Throw error instead of returning empty array
  }
};
