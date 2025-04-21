
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CategorySkeletonProps = {
  isAllPostsView: boolean;
};

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ isAllPostsView }) => {
  return (
    <div className={`grid gap-6 ${isAllPostsView ? "" : "md:grid-cols-2 lg:grid-cols-3"}`}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className={`h-full ${isAllPostsView ? "flex flex-col md:flex-row" : ""}`}>
          {isAllPostsView && (
            <div className="md:w-1/3 p-4">
              <Skeleton className="h-40 w-full rounded-md" />
            </div>
          )}
          <div className={`${isAllPostsView ? "md:w-2/3" : "w-full"}`}>
            <CardHeader className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-4/5 mb-1" />
              <Skeleton className="h-4 w-3/5" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-3 w-16" />
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
};
