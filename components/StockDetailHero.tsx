// components/StockDetailHero.tsx
"use client";

import { Button } from "./ui/button";
import { Plus, Minus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/authcontext"; // Assuming for user ID

interface StockDetailHeroProps {
  ticker: string;
  name: string;
  exchange: string;
  logoUrl: string;
  price: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  marketState: "OPEN" | "CLOSED" | "PRE" | "POST";
  // ... other pre/post market props
}

export function StockDetailHero({
  ticker,
  name,
  exchange,
  logoUrl,
  price,
  change,
  changeType,
  marketState,
}: StockDetailHeroProps) {
  
  // TODO: Add logic for Add/Remove from Watchlist
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const { user } = useAuth();
  
  // Placeholder: This logic needs to be fully implemented
  const isInWatchlist = false; // This needs to be passed down or fetched
  const handleWatchlistToggle = async () => {
    setIsWatchlistLoading(true);
    toast.info("Watchlist functionality to be implemented.");
    // ... (Add/Remove logic here)
    setIsWatchlistLoading(false);
  };

  const priceColor =
    changeType === "positive"
      ? "text-green-500"
      : changeType === "negative"
      ? "text-red-500"
      : "text-foreground";

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        {/* Logo (from API) */}
        {logoUrl ? (
          <img src={logoUrl} alt={`${name} Logo`} className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-2xl font-semibold">
            {ticker[0]}
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
          {/* TODO: Add Pre/Post Market Price Display Here */}
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