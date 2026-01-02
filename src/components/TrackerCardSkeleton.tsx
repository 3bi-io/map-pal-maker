import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TrackerCardSkeleton = () => {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackerCardSkeleton;
