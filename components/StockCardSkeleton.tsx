import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StockCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-4 w-32 rounded-md" />
      </CardHeader>
      <div className="h-20 w-full px-6">
        <Skeleton className="h-full w-full rounded-md" />
      </div>
      <CardContent className="flex items-baseline justify-between pt-4">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </CardContent>
    </Card>
  );
}