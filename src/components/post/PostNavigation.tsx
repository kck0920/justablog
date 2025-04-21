import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostNavigationProps {
  previous: {
    title: string;
    slug: string;
  } | null;
  next: {
    title: string;
    slug: string;
  } | null;
}

export function PostNavigation({ previous, next }: PostNavigationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8 border-t border-zinc-200 dark:border-zinc-700">
      {previous && (
        <Link
          to={`/post/${previous.slug}`}
          className={cn(
            "group flex flex-col gap-1 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg transition-colors",
            "relative overflow-hidden"
          )}
        >
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">이전 글</span>
          </div>
          <h3 className="font-medium line-clamp-2 text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {previous.title}
          </h3>
        </Link>
      )}
      
      {next && (
        <Link
          to={`/post/${next.slug}`}
          className={cn(
            "group flex flex-col gap-1 p-4 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg transition-colors",
            "relative overflow-hidden",
            !previous && "md:col-start-2"
          )}
        >
          <div className="flex items-center justify-end gap-2 text-zinc-500 dark:text-zinc-400">
            <span className="text-sm">다음 글</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          <h3 className="font-medium line-clamp-2 text-right text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {next.title}
          </h3>
        </Link>
      )}
    </div>
  );
} 