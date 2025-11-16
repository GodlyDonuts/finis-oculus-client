// components/StockDetailHero.tsx
"use client";

import { Button } from "./ui/button";
import { Plus, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authcontext";
import { StockDetailData } from "@/app/stock/[ticker]/page"; // Import main type
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface StockDetailHeroProps {
  data: StockDetailData | null; // Accept null data
}

export function StockDetailHero({ data }: StockDetailHeroProps) {
  // Kinetix: Component-level loading state
  const isLoading = !data;

  // Destructure data with fallbacks for "calm loading"
  const {
    ticker,
    name,
    exchange,
    logoUrl,
    price,
    change,
    changeType,
    marketState,
  } = data || {};

  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const { user } = useAuth();
  
  const isInWatchlist = false; // Placeholder
  const handleWatchlistToggle = async () => {
    setIsWatchlistLoading(true);
    toast.info("Watchlist functionality to be implemented.");
    setIsWatchlistLoading(false);
  };

  const priceColor =
    changeType === "positive"
      ? "text-green-500"
      : changeType === "negative"
      ? "text-red-500"
      : "text-foreground";

  // --- Kinetix: "Calm Loading" Skeletons ---
  if (isLoading) {
    return (
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
    );
  }
  // --- End Skeletons ---

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {logoUrl ? (
          <img src={logoUrl} alt={`${name} Logo`} className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
            {ticker ? ticker[0] : ""}
          </div>
        )}
        <div>
          <h1 className="font-serif-display text-5xl font-semibold text-foreground">
            {name || ticker}
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
            {ticker} &middot; {exchange || "N/A"}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-6 md:mt-0">
        <div className="text-right">
          <span className={cn("text-5xl font-extrabold tracking-tight", priceColor)}>
            ${price?.toFixed(2) ?? "N/A"}
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className={cn("text-2xl font-semibold", priceColor)}>
              {change ?? "-"}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {marketState === "OPEN" ? "Market Open" : "Market Closed"}
            </span>
          </div>
        </div>

        <Button
          size="lg"
          variant={isInWatchlist ? "outline" : "default"}
          onClick={handleWatchlistToggle}
          disabled={isWatchlistLoading}
          className="w-48"
        >
          {isWatchlistLoading ? (
            <Loader2 className="animate-spin" />
          ) : isInWatchlist ? (
            <>
              <Minus className="mr-2 h-5 w-5" /> Remove
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" /> Add to Watchlist
            </>
          )}
        </Button>
      </div>
    </header>
  );
}