
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PostsTable } from "./PostsTable";

interface Post {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  views: number;
  content: string;
  featured: boolean;
  thumbnailPreview: string | null;
  slug: string;
}

interface PostsManagementProps {
  posts: Post[];
  onPreview: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onView?: (postId: string) => void;
}

export const PostsManagement: React.FC<PostsManagementProps> = ({ 
  posts, 
  onPreview, 
  onEdit, 
  onDelete,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>포스트 관리</CardTitle>
        <CardDescription>기존 포스트들을 관리하고 수정하세요</CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="포스트 검색..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <PostsTable 
          posts={filteredPosts} 
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      </CardContent>
    </Card>
  );
};
