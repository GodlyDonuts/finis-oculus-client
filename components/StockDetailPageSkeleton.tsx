// components/StockDetailPageSkeleton.tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StockDetailPageSkeleton() {
  return (
    <main className="container mx-auto p-8">
      {/* Zone 1: Hero Skeleton */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-12 w-64 rounded-lg" />
            <Skeleton className="mt-2 h-6 w-32 rounded-lg" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-6 md:mt-0">
          <div className="text-right">
            <Skeleton className="h-12 w-40 rounded-lg" />
            <Skeleton className="mt-2 h-6 w-56 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-48 rounded-xl" />
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Zone 3: Workbench (Main) Skeleton */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* Tabs Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
          {/* Chart Card Skeleton */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>

        {/* Zone 2: Sidebar Skeleton */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          {/* Prism Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-full" />
            </CardContent>
          </Card>
          {/* Sentiment Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-14 w-24 rounded-md" />
              <Skeleton className="mt-2 h-6 w-40 rounded-md" />
            </CardContent>
          </Card>
          {/* Key Stats Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 rounded-md" />
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
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