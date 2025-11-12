// app/dashboard/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import { AddStockDialog } from "@/components/AddStockDialog";
import { toast } from "sonner";
import { db } from "@/app/firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  LayoutGrid,
} from "lucide-react"; // --- ADDED ICONS ---
import { cn } from "@/lib/utils"; // Import cn

const marketOverviewData = [
  {
    name: "S&P 500",
    value: "5,432.10",
    change: "+0.5%",
    changeType: "positive",
    icon: TrendingUp, // --- ADDED ---
  },
  {
    name: "NASDAQ",
    value: "17,650.80",
    change: "+1.2%",
    changeType: "positive",
    icon: TrendingUp, // --- ADDED ---
  },
  {
    name: "DOW 30",
    value: "39,112.50",
    change: "-0.2%",
    changeType: "negative",
    icon: TrendingDown, // --- ADDED ---
  },
];

// This is the data type our StockCard component expects
type Stock = {
  ticker: string;
  name: string;
  price: number;
  sentiment: number;
  sparkline: number[];
};

// Get the API URL from the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  // --- UPDATED: Get 'isPremium' from useAuth ---
  const { user, loading: authLoading, isPremium } = useAuth();
  const router = useRouter();

  // Is the page initializing (e.g., loading user auth)?
  const [isInitializing, setIsInitializing] = useState(true);
  // Is the page actively fetching stock data?
  const [isFetchingData, setIsFetchingData] = useState(true);

  // We now have two states:
  // 1. The list of tickers (the "truth" from Firestore)
  const [tickerList, setTickerList] = useState<string[]>([]);
  // 2. The resolved data for those tickers (from our API)
  const [watchlistData, setWatchlistData] = useState<Stock[]>([]);

  const [newTicker, setNewTicker] = useState("");
  // --- NEW: Loading state for the inline form ---
  const [isInlineValidating, setIsInlineValidating] = useState(false);

  // --- Auth Protection ---
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        // User is logged in, stop initializing
        setIsInitializing(false);
      }
    }
  }, [user, authLoading, router]);

  // --- REFACTOR: Step 1 - Combined Data Fetching Function ---
  // This one function now handles getting the ticker list AND fetching
  // all the data for them in a single batch.
  const fetchWatchlistData = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);
    
    try {
      // 1. Get the list of tickers from Firestore
      const watchlistCollection = collection(db, "users", user.uid, "watchlist");
      const querySnapshot = await getDocs(watchlistCollection);
      const tickers = querySnapshot.docs.map(doc => doc.id);
      
      setTickerList(tickers); // Still set the raw list for checks (e.g., duplicates)

      // 2. If the user has no tickers, stop here
      if (tickers.length === 0) {
        setWatchlistData([]);
        setIsFetchingData(false);
        return;
      }

      // 3. --- NEW BATCH FETCH ---
      // Get the token once
      const token = await user.getIdToken();
      
      // Call a new batch endpoint (you will need to create this)
      // This sends all tickers at once and expects an array of data back
      const res = await fetch(`${API_URL}/get_watchlist_details`, { // Assumed endpoint
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers: tickers }), // Send the array of tickers
      });

      if (!res.ok) {
        throw new Error("Failed to fetch watchlist data");
      }

      const results = await res.json(); // Expect an array of stock data

      // 4. Format the results (same as before, just on the new 'results' array)
      const formattedData = results.map((data: any) => ({ // Added 'any' for data
        ticker: data.ticker,
        name: data.ticker, // TODO: API doesn'g provide name yet, use ticker
        price: data.livePrice.c, // 'c' is the 'current price' from Finnhub
        sentiment: data.sentiment.score,
        // TODO: API doesn't provide sparkline, so we fake it for now
        sparkline: Array.from({ length: 7 }, () => (Math.random() * 20) + (data.livePrice.c - 10)),
      }));

      setWatchlistData(formattedData);

    } catch (error) {
      console.error("Error fetching watchlist data: ", error);
      toast.error("Could not load your watchlist data.");
    } finally {
      setIsFetchingData(false);
    }
  }, [user]);

  // --- REFACTOR: Step 2 - Simplified Data Fetching Effect ---
  // This single effect runs when the user is available,
  // calling our all-in-one function.
  useEffect(() => {
    if (user) {
      fetchWatchlistData();
    }
  }, [user, fetchWatchlistData]);

  // --- Step 3: Handle Adding a Stock (This is now JUST the API call) ---
  // --- UPDATED: Added Premium Limit Check ---
  const handleAddStock = async (ticker: string) => {
    if (!user) return;
    
    // --- THIS IS THE NEW PREMIUM LIMIT CHECK ---
    const currentCount = tickerList.length;
    if (!isPremium && currentCount >= 15) {
      // --- UPDATED TOAST MESSAGE ---
      toast.error("Free Plan Limit Reached", {
        description: "Please delete an existing stock or upgrade to Premium to add more."
      });
      return; // Stop the function here
      // --- END UPDATED TOAST MESSAGE ---
    }
    // --- END NEW CHECK ---

    // Ticker is already uppercased
    if (tickerList.includes(ticker)) {
      toast.error(`${ticker} is already in your watchlist.`);
      return;
    }

    // Start a toast just for the "adding" step.
    const toastId = toast.loading(`Adding ${ticker} to watchlist...`);
    
    try {
      const token = await user.getIdToken();

      // --- Go straight to the "add" call ---
      const res = await fetch(`${API_URL}/add_to_watchlist/${ticker}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add stock");
      }
      
      toast.success(`${ticker} added to watchlist!`, { id: toastId });
      
      // Refresh all data to ensure perfect consistency
      fetchWatchlistData();

    } catch (error: any) { //
      console.error("Error adding stock: ", error);
      toast.error(error.message || `Failed to add ${ticker}.`, { id: toastId });
    }
  };

  // --- Step 4: Handle Removing a Stock (Calls our API) ---
  const handleRemoveStock = async (ticker: string) => {
    if (!user) return;
    
    const toastId = toast.loading(`Removing ${ticker}...`);

    try {
      // First, delete from the backend (to update master count)
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/remove_from_watchlist/${ticker}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to remove stock from backend");
      }

      // Also delete from the user's "watchlist" collection in Firestore
      const stockDocRef = doc(db, "users", user.uid, "watchlist", ticker);
      await deleteDoc(stockDocRef);

      // --- REFACTOR: Step 5 - Refresh all data on success ---
      toast.success(`${ticker} removed from watchlist.`, { id: toastId });
      // Re-fetch all data to ensure perfect consistency.
      fetchWatchlistData();

    } catch (error) {
      console.error("Error removing stock: ", error);
      toast.error(`Failed to remove ${ticker}.`, { id: toastId });
    }
  };

  // --- UPDATED: Inline Form Handler (Now validates) ---
  const handleInlineAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicker.trim()) {
      toast.error("Please enter a ticker.");
      return;
    }

    const upperTicker = newTicker.toUpperCase();
    setIsInlineValidating(true);
    const validationToastId = toast.loading(`Validating ${upperTicker}...`);

    try {
      // 1. Call validation route
      const response = await fetch(`/api/validate/${upperTicker}`);

      if (!response.ok) {
        // Ticker is invalid
        const data = await response.json();
        toast.error(data.error || `Invalid ticker: ${upperTicker}`, { id: validationToastId });
        return;
      }

      // 2. If valid, dismiss toast and call the *real* add function
      toast.dismiss(validationToastId);
      await handleAddStock(upperTicker); // This already shows its own toasts
      setNewTicker(""); // Clear input on success

    } catch (error) {
      // For network errors, etc.
      toast.error("Validation failed. Please try again.", { id: validationToastId });
      console.error("Validation error:", error);
    } finally {
      setIsInlineValidating(false);
    }
  };

  // --- RENDER LOGIC ---

  if (isInitializing) {
    // Page is loading auth, show minimal skeleton
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

  // User is loaded, now show the page
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
              const Icon = index.icon; // --- ADDED ---
              return (
                <Card key={index.name} className="hover:border-primary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                      {index.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-semibold">{index.value}</p>
                      {/* --- ADDED ICON --- */}
                      <Icon className={cn("h-6 w-6", color)} />
                    </div>
                    <p className={cn("text-sm font-medium", color)}>
                      {index.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-serif-display text-4xl font-semibold text-foreground">
              Your Watchlist
            </h2>
            <p className="mt-1 text-lg text-muted-foreground">
              Your personal AI-powered market dashboard.
            </p>
          </div>
          {!isFetchingData && (
            // Pass the REAL add function to the dialog
            <AddStockDialog onStockAdded={handleAddStock} />
          )}
        </header>

        {isFetchingData ? (
          // Show skeletons while *loading from API*
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(tickerList.length || 3)].map((_, i) => (
              <StockCardSkeleton key={i} />
            ))}
          </div>
        ) : watchlistData.length > 0 ? (
          // Show real cards when loaded
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {watchlistData.map((stock) => (
              <div key={stock.ticker} className="relative group">
                <StockCard
                  ticker={stock.ticker}
                  name={stock.name}
                  price={stock.price}
                  sentiment={stock.sentiment}
                  sparkline={stock.sparkline}
                />
                <Button
                  variant="destructive"
                  size="icon-sm"
                  className="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveStock(stock.ticker)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 p-12">
            {/* --- ADDED ICON --- */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-input">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-medium text-foreground">
              Your watchlist is empty
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add stocks to your watchlist to start tracking them.
            </p>
            {/* --- UPDATED FORM --- */}
            <form
              onSubmit={handleInlineAdd}
              className="mt-6 flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                placeholder="Enter ticker (e.g., AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value.toUpperCase())}
                className="h-12 flex-1" // Taller input
                disabled={isInlineValidating} // Disable while validating
              />
              <Button type="submit" size="lg" disabled={isInlineValidating}>
                {isInlineValidating ? "Checking..." : "Add Stock"}
              </Button>
            </form>
            {/* --- END UPDATED FORM --- */}
          </div>
        )}
      </motion.main>
    </div>
  );
}