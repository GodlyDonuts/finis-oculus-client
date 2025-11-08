import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StockCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-16" />
      </CardContent>
    </Card>
  );
}