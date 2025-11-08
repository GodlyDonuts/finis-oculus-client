"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
// Removed the plain Button import
import { Header } from "@/components/Header";
import StockCard from "@/components/StockCard";
import { StockCardSkeleton } from "@/components/StockCardSkeleton";
import { AddStockDialog } from "@/components/AddStockDialog"; // Import the dialog

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Mock watchlist data.
  // const watchlist = ["AAPL", "GOOGL", "TSLA"];
  const watchlist: string[] = []; // Test empty state

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate 1.5 second load
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold text-foreground">
            Your Watchlist
          </h1>
        </header>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? // Show skeletons while loading
                watchlist.map((ticker) => <StockCardSkeleton key={ticker} />)
              : // Show real cards when loaded
                watchlist.map((ticker) => <StockCard key={ticker} ticker={ticker} />)}
          </div>
        ) : (
          // Empty State UI with the Dialog
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
            <h2 className="text-2xl font-medium text-foreground">
              Your watchlist is empty.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add stocks to your watchlist to start tracking them.
            </p>
            <AddStockDialog /> {/* Use the new component here */}
          </div>
        )}
      </main>
    </div>
  );
}