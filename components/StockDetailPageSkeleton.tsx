import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StockDetailPageSkeleton() {
  return (
    <main className="container mx-auto p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="h-12 w-3/4" />
        <div className="mt-4 flex items-baseline gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content (Left) Skeletons */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* AI Summary Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </CardContent>
          </Card>
          {/* Price Chart Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right) Skeletons */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          {/* AI Sentiment Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-14 w-24" />
              <Skeleton className="mt-2 h-6 w-40" />
              <Skeleton className="mt-6 h-40 w-full" />
            </CardContent>
          </Card>
          {/* Key Statistics Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}