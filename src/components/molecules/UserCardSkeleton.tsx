import { Card, Skeleton } from "@/components/atoms";

export const UserCardSkeleton = () => {
  return (
    <Card>
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
    </Card>
  );
};
