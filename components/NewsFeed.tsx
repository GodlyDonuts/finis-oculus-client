// components/NewsFeed.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";

// News item type to match our new API
type NewsItem = {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  link: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

// Re-define the icon helper here for encapsulation
const NewsSentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment === "positive") {
    return <TrendingUp className="h-5 w-5 flex-shrink-0 text-green-500" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="h-5 w-5 flex-shrink-0 text-red-500" />;
  }
  return <Minus className="h-5 w-5 flex-shrink-0 text-gray-500" />;
};

// --- The NewsFeed Component ---
export function NewsFeed({ ticker }: { ticker: string }) {
  const [filter, setFilter] = useState("all");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // This effect runs when the filter changes
  useEffect(() => {
    // --- THIS IS THE FIX ---
    // If ticker isn't loaded yet (it's an empty string), don't fetch.
    if (!ticker) {
      return; 
    }
    // --- END FIX ---

    // Reset state and fetch new data for the new filter
    setNewsItems([]);
    setPage(1);
    setHasMore(true);
    fetchNews(1, filter, true);
  }, [filter, ticker]); // 'ticker' is a dependency

  const fetchNews = async (
    pageToFetch: number,
    currentFilter: string,
    isFilterChange: boolean = false
  ) => {
    // --- THIS IS A SECONDARY FIX ---
    // Double-check ticker isn't empty before fetching
    if (isLoading || !ticker) return;
    // --- END FIX ---

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/stock-news/${ticker}?page=${pageToFetch}&filter=${currentFilter}`
      );
      
      if (!res.ok) {
        // Try to parse the error from the API
        try {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch news");
        } catch (e) {
          throw new Error("Failed to fetch news");
        }
      }
      
      const data = await res.json();

      setNewsItems((prevItems) => 
        isFilterChange ? data.news : [...prevItems, ...data.news]
      );
      setPage(data.nextPage);
      setHasMore(data.hasMore);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchNews(page, filter);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => value && setFilter(value)}
          className="mb-4 grid grid-cols-3"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="news">News</ToggleGroupItem>
          <ToggleGroupItem value="filings">SEC Filings</ToggleGroupItem>
        </ToggleGroup>

        <div className="flex flex-col gap-6">
          {newsItems.length > 0 && (
            <div className="flex flex-col gap-6">
              {newsItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 border-b border-border/50 pb-6 last:border-b-0 last:pb-0">
                  <NewsSentimentIcon sentiment={item.sentiment} />
                  <div className="flex-1">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group font-medium text-foreground hover:underline"
                    >
                      {item.headline}
                      <ExternalLink className="ml-1 inline-block h-4 w-4 text-muted-foreground transition-all group-hover:text-primary" />
                    </a>
                    <div className="mt-1 flex gap-2 text-sm text-muted-foreground">
                      <span>{item.source}</span>
                      <span>&middot;</span>
      
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full rounded" />
                    <Skeleton className="h-4 w-1/3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && newsItems.length === 0 && (
            <p className="text-center text-muted-foreground">
              No {filter} items found for {ticker}.
            </p>
          )}

          {hasMore && !isLoading && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}