"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";
import { Header } from "@/components/Header";
import StockCard from "@/components/StockCard";
import { StockCardSkeleton } from "@/components/StockCardSkeleton";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; //

// ... (marketOverviewData and mockWatchlist remain the same) ...
const marketOverviewData = [
  {
    name: "S&P 500",
    value: "5,432.10",
    change: "+0.5%",
    changeType: "positive",
  },
  {
    name: "NASDAQ",
    value: "17,650.80",
    change: "+1.2%",
    changeType: "positive",
  },
  {
    name: "DOW 30",
    value: "39,112.50",
    change: "-0.2%",
    changeType: "negative",
  },
];

const mockWatchlist = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 189.99,
    sentiment: 0.75,
    sparkline: [180, 182, 181, 184, 186, 185, 189],
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 177.85,
    sentiment: 0.5,
    sparkline: [170, 172, 171, 175, 174, 176, 177],
  },
  {
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 175.22,
    sentiment: -0.2,
    sparkline: [180, 178, 176, 172, 174, 173, 175],
  },
];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth(); //
  const router = useRouter(); //
  const [isLoading, setIsLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<typeof mockWatchlist>([]);

  // --- Auth Protection ---
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login"); // Redirect if not logged in
    }
  }, [user, authLoading, router]);
  // --- End Auth Protection ---

  // Simulate data fetching and real-time updates
  useEffect(() => {
    if (!user) return; // Don't fetch data if no user

    const timer = setTimeout(() => {
      setWatchlist(mockWatchlist);
      setIsLoading(false);
    }, 1500);

    const intervalId = setInterval(() => {
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 0.5,
          sparkline: [
            ...stock.sparkline.slice(1),
            stock.sparkline[stock.sparkline.length - 1] +
              (Math.random() - 0.5) * 1,
          ],
        }))
      );
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, [user]); // Add user as a dependency

  // Show skeleton while auth is loading or user is being redirected
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  // --- Original Page Content (now confirmed to be for a logged-in user) ---
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto p-8"
      >
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            Market Overview
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {marketOverviewData.map((index) => {
              const color =
                index.changeType === "positive"
                  ? "text-green-500"
                  : "text-red-500";
              return (
                <Card key={index.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {index.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{index.value}</p>
                    <p className={`text-sm font-medium ${color}`}>
                      {index.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <header className="mb-8">
          <h1 className="font-serif-display text-4xl font-semibold text-foreground">
            Welcome, {user.email}
          </h1>
          <h2 className="font-serif-display text-4xl font-semibold text-foreground">
            Your Watchlist
          </h2>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        ) : watchlist.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((stock) => (
              <StockCard
                key={stock.ticker}
                ticker={stock.ticker}
                name={stock.name}
                price={stock.price}
                sentiment={stock.sentiment}
                sparkline={stock.sparkline}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
            <h2 className="text-2xl font-medium text-foreground">
              Your watchlist is empty.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add stocks to your watchlist to start tracking them.
            </p>
            <div className="mt-6 flex w-full max-w-sm items-center space-x-2">
              <Input placeholder="Enter ticker (e.g., AAPL)" />
              <Button type="submit">Add Stock</Button>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}