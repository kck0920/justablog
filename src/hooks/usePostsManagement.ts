
import { useState, useEffect, useCallback } from 'react';
import { Post } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAllPosts, 
  deletePostById, 
  deleteDraftAfterPublish,
  savePost,
  incrementViewCount 
} from '@/api/posts';
import { 
  updatePostsArray, 
  filterDeletedPost 
} from '@/utils/postUtils';

export const usePostsManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch posts from Supabase
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching posts');
      
      const data = await fetchAllPosts();
      console.log('Posts fetched successfully:', data);
      
      setPosts(data);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      toast({
        title: "포스트 로딩 실패",
        description: error.message || "포스트를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  // Delete a post
  const deletePost = async (postId: string) => {
    try {
      await deletePostById(postId);
      
      // Update local state
      setPosts(filterDeletedPost(posts, postId));
      
      toast({
        title: "포스트 삭제됨",
        description: "포스트가 성공적으로 삭제되었습니다.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: "포스트 삭제 실패",
        description: error.message || "포스트 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  // Publish a post
  const publishPost = async (post: Post, thumbnailFile: File | null = null) => {
    try {
      console.log("Publishing post:", post.title);
      
      // 1. 먼저 포스트를 발행 상태로 저장
      const updatedPost = await savePost(post, 'published', thumbnailFile);
      console.log("Post published successfully:", updatedPost);
      
      // 2. 발행 성공 후 같은 슬러그를 가진 draft 포스트 삭제
      if (updatedPost && updatedPost.slug) {
        console.log("Deleting draft version after successful publish");
        await deleteDraftAfterPublish(updatedPost.slug);
      }
      
      // 3. Update local state
      setPosts(updatePostsArray(posts, updatedPost));
      
      toast({
        title: "포스트 발행됨",
        description: "포스트가 성공적으로 발행되었습니다.",
      });
      
      return updatedPost;
    } catch (error: any) {
      console.error("Error publishing post:", error);
      toast({
        title: "포스트 발행 실패",
        description: error.message || "포스트 발행 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Save draft
  const saveDraft = async (post: Post, thumbnailFile: File | null = null) => {
    try {
      const updatedPost = await savePost(post, 'draft', thumbnailFile);
      
      // Update local state
      setPosts(updatePostsArray(posts, updatedPost));
      
      toast({
        title: "임시 저장됨",
        description: "포스트가 임시 저장되었습니다.",
      });
      
      return updatedPost;
    } catch (error: any) {
      toast({
        title: "임시 저장 실패",
        description: error.message || "포스트 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      console.error("Error saving draft:", error);
      throw error;
    }
  };
  
  // Increment view count
  const incrementPostView = async (postId: string) => {
    try {
      const updatedPost = await incrementViewCount(postId);
      
      // Update local state
      setPosts(updatePostsArray(posts, updatedPost));
      return updatedPost;
    } catch (error: any) {
      console.error("Error incrementing view count:", error);
      // Silently fail - we don't want to show an error toast for view count issues
      return null;
    }
  };
  
  return {
    posts,
    loading,
    deletePost,
    publishPost,
    saveDraft,
    fetchPosts,
    incrementPostView
  };
};
