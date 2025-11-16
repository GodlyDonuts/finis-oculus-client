// components/NewsFeed.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Now just loads once

  // This effect runs once when the ticker is available
  useEffect(() => {
    if (!ticker) {
      return; // Don't fetch if ticker is empty
    }

    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // Fetch from the simplified API
        const res = await fetch(`/api/stock-news/${ticker}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch news");
        }
        
        const data = await res.json();
        setNewsItems(data.news);

      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [ticker]); // Only depends on ticker

  return (
    <Card>
      <CardContent className="pt-6">
        {/* We no longer show filters */}
        
        <div className="flex flex-col gap-6">
          {isLoading && (
            // Show skeletons on initial load
            <div className="flex flex-col gap-6">
              {[...Array(5)].map((_, i) => (
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

          {!isLoading && newsItems.length > 0 && (
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

          {!isLoading && newsItems.length === 0 && (
            <p className="text-center text-muted-foreground">
              No recent news items found for {ticker}.
            </p>
          )}

          {/* We no longer show a "Load More" button */}
        </div>
      </CardContent>
    </Card>
  );
}