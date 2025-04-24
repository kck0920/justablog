import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Post } from "@/types/post";
import { ArrowRight } from "lucide-react";

type CategoryPostCardProps = {
  post: Post;
  isAllPostsView: boolean;
};

export const CategoryPostCard: React.FC<CategoryPostCardProps> = ({ post, isAllPostsView }) => {
  return (
    <Link to={`/post/${post.slug}`} className="group h-full">
      <Card className={`h-full overflow-hidden transition-all hover:shadow-md flex ${isAllPostsView ? "md:flex-row" : "flex-col"} hover:bg-muted/50 dark:hover:bg-slate-850`}>
        <div className={`${isAllPostsView ? "md:w-1/3" : ""} p-4`}>
          {post.thumbnailUrl ? (
            <AspectRatio ratio={4/3} className="bg-muted rounded-md overflow-hidden">
              <img 
                src={post.thumbnailUrl} 
                alt={post.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
          ) : (
            <div className="bg-muted rounded-md w-full h-full flex items-center justify-center aspect-[4/3]">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
        <div className={`${isAllPostsView ? "md:w-2/3" : ""} flex flex-col flex-1`}>
          <CardHeader className="p-4 flex-none">
            <div className="flex justify-between items-start">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="text-xs text-muted-foreground">{post.date}</div>
            </div>
            <CardTitle className="mt-2 group-hover:text-primary transition-colors line-clamp-2 h-[3rem]">
              {post.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex-1">
            <CardDescription className={`${isAllPostsView ? "line-clamp-4" : "line-clamp-3"}`}>
              {post.excerpt}
            </CardDescription>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center flex-none">
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
            <div className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
              자세히 보기
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
};
