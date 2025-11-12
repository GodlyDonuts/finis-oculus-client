import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StockDetailPageSkeleton() {
  return (
    <main className="container mx-auto p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="h-12 w-3/4 rounded-lg" />
        <div className="mt-4 flex items-baseline gap-4">
          <Skeleton className="h-10 w-48 rounded-lg" />
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content (Left) Skeletons */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Price Chart Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-8 w-64 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-96 w-full rounded-lg" />
            </CardContent>
          </Card>
           {/* AI Summary Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right) Skeletons */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          {/* AI Sentiment Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-14 w-24 rounded-md" />
              <Skeleton className="mt-2 h-6 w-40 rounded-md" />
              <Skeleton className="mt-6 h-40 w-full rounded-lg" />
            </CardContent>
          </Card>
          {/* Key Statistics Card */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}