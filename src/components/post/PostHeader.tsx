
import { Badge } from "@/components/ui/badge";

interface PostHeaderProps {
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  category,
  date,
  readTime,
  author
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge>{category}</Badge>
        <span className="text-sm text-muted-foreground">{date}</span>
        <span className="text-sm text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">{readTime}</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h1>
      <div className="flex items-center">
        <p className="text-muted-foreground">By {author}</p>
      </div>
    </div>
  );
};
