
import { Post } from "@/types/post";
import { CategoryPostCard } from "./CategoryPostCard";

type CategoryPostListProps = {
  posts: Post[];
  isAllPostsView: boolean;
};

export const CategoryPostList: React.FC<CategoryPostListProps> = ({ posts, isAllPostsView }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">이 카테고리에 게시글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${isAllPostsView ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {posts.map((post) => (
        <CategoryPostCard 
          key={post.id} 
          post={post} 
          isAllPostsView={isAllPostsView} 
        />
      ))}
    </div>
  );
};
