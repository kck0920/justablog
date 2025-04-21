import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TabNavigation } from "@/components/admin/TabNavigation";
import { PostsManagement } from "@/components/admin/PostsManagement";
import { EditorSection } from "@/components/admin/EditorSection";
import { PostPreview } from "@/components/admin/PostPreview";
import { SubscribersManagement } from "@/components/admin/SubscribersManagement";
import { useNavigate } from "react-router-dom";

// Custom hooks
import { usePostsManagement } from "@/hooks/usePostsManagement";
import { usePostPreview } from "@/hooks/usePostPreview";
import { usePostEditor } from "@/hooks/usePostEditor";
import { useTabs } from "@/hooks/useTabs";
import { Post } from "@/types/admin";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthHelpers } from "@/hooks/useAuthHelpers";

const AdminPage = () => {
  const { posts, loading, deletePost, publishPost, saveDraft, fetchPosts, incrementPostView } = usePostsManagement();
  const { previewOpen, setPreviewOpen, previewContent, openPreview, openPostPreview } = usePostPreview();
  const { editingPost, editPost, clearEditingPost } = usePostEditor();
  const { activeTab, setActiveTab, tabs } = useTabs("posts");
  const { user } = useAuth();
  const { handleLogout } = useAuthHelpers();
  const navigate = useNavigate();

  // Tab change handler
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "editor") {
      clearEditingPost();
    }
  };

  // Fetch posts when tab is active or refresh needed
  React.useEffect(() => {
    if (activeTab === 'posts') {
      console.log("AdminPage: Fetching posts for 'posts' tab");
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

  // Handle post preview without view increment
  const handlePostPreview = (post: Post) => {
    openPostPreview(post);
  };

  // Handle actual post view with view increment
  const handlePostView = (postId: string) => {
    console.log("Incrementing view count for post", postId);
    incrementPostView(postId)
      .then(() => {
        console.log("View count incremented, refreshing posts data");
        fetchPosts();
      })
      .catch(err => {
        console.error("Failed to increment view count:", err);
      });
  };

  // Handle save draft with thumbnail file
  const handleSaveDraft = (post: Post, thumbnailFile: File | null) => {
    return saveDraft(post, thumbnailFile);
  };

  // Handle publish with thumbnail file
  const handlePublish = (post: Post, thumbnailFile: File | null) => {
    return publishPost(post, thumbnailFile);
  };

  return (
    <div className="container-custom py-8">
      <AdminHeader 
        username={user?.name} 
        onLogout={handleLogout}
      />
      <TabNavigation 
        tabs={[
          { id: 'posts', label: '포스트' },
          { id: 'editor', label: '에디터' },
          { id: 'subscribers', label: '구독자' }
        ]} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {loading && activeTab === 'posts' ? (
        <div className="flex justify-center items-center p-12">
          <p className="text-lg text-muted-foreground">로딩 중...</p>
        </div>
      ) : activeTab === 'posts' ? (
        <PostsManagement 
          posts={posts}
          onPreview={handlePostPreview}
          onEdit={(post) => {
            editPost(post);
            setActiveTab("editor");
          }}
          onDelete={deletePost}
          onView={handlePostView}
        />
      ) : activeTab === 'editor' ? (
        <EditorSection 
          editingPost={editingPost}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onPreview={openPreview}
        />
      ) : activeTab === 'subscribers' ? (
        <SubscribersManagement />
      ) : null}
      
      <PostPreview 
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        previewContent={previewContent}
      />
    </div>
  );
};

export default AdminPage;
