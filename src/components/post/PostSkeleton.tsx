
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const PostSkeleton = () => {
  return (
    <div className="min-h-screen py-12">
      <article className="container-custom max-w-3xl">
        <div className="mb-8">
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Separator className="my-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </article>
    </div>
  );
};
