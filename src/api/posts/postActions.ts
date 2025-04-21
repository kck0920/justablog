import { PostFormData } from "@/types/admin";
import { supabase } from "@/lib/supabase";

export const createPost = async (postData: PostFormData) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePost = async (postId: string, postData: PostFormData) => {
  const { data, error } = await supabase
    .from("posts")
    .update(postData)
    .eq("id", postId)
    .select()
    .single();

  if (error) throw error;
  return data;
}; 