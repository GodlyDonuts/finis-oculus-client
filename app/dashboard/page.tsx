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
import { X } from "lucide-react";

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
  const { user, loading: authLoading } = useAuth();
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

  // --- Step 1: Fetch the list of tickers from Firestore ---
  const fetchTickerList = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);
    try {
      const watchlistCollection = collection(db, "users", user.uid, "watchlist");
      const querySnapshot = await getDocs(watchlistCollection);
      
      // We only care about the *document IDs* (the tickers)
      const tickers = querySnapshot.docs.map(doc => doc.id);
      setTickerList(tickers);
    } catch (error) {
      console.error("Error fetching ticker list: ", error);
      toast.error("Could not load your watchlist.");
      setIsFetchingData(false);
    }
  }, [user]);

  // Run Step 1 when the user logs in
  useEffect(() => {
    if (user) {
      fetchTickerList();
    }
  }, [user, fetchTickerList]);

  // --- Step 2: Fetch full data from our API whenever the ticker list changes ---
  useEffect(() => {
    if (!user || tickerList.length === 0) {
      setWatchlistData([]); // Clear data if list is empty
      setIsFetchingData(false);
      return;
    }

    const fetchAllStockData = async () => {
      setIsFetchingData(true);
      try {
        const token = await user.getIdToken();
        
        // Create an array of fetch promises
        const promises = tickerList.map(ticker =>
          fetch(`${API_URL}/get_stock_details/${ticker}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }).then(res => {
            if (!res.ok) {
              // Log the error but don't stop Promise.all
              console.error(`Failed to fetch ${ticker}`);
              return null; // Return null for failed fetches
            }
            return res.json();
          })
        );

        const results = await Promise.all(promises);

        // Filter out any nulls from failed requests
        const validResults = results.filter(data => data !== null);

        // Map the API response to the 'Stock' type our cards expect
        const formattedData = validResults.map(data => ({
          ticker: data.ticker,
          name: data.ticker, // TODO: API doesn'g provide name yet, use ticker
          price: data.livePrice.c, // 'c' is the 'current price' from Finnhub
          sentiment: data.sentiment.score,
          // TODO: API doesn't provide sparkline, so we fake it for now
          sparkline: Array.from({ length: 7 }, () => (Math.random() * 20) + (data.livePrice.c - 10)),
        }));

        setWatchlistData(formattedData);

      } catch (error) {
        console.error("Error fetching stock details: ", error);
        toast.error("Error fetching stock data. Please refresh.");
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchAllStockData();
  }, [tickerList, user]); // Re-run this entire effect if the ticker list changes

  // --- Step 3: Handle Adding a Stock (Calls our API) ---
  const handleAddStock = async (ticker: string) => {
    if (!user) return;
    ticker = ticker.toUpperCase();
    if (tickerList.includes(ticker)) {
      toast.error(`${ticker} is already in your watchlist.`);
      return;
    }

    // Start a multi-step toast
    const toastId = toast.loading(`Verifying ${ticker}...`);
    
    try {
      const token = await user.getIdToken();

      // --- NEW VALIDATION STEP ---
      // We first try to GET the stock details.
      // This acts as our validation. If this fails, the ticker is invalid.
      const validateRes = await fetch(`${API_URL}/get_stock_details/${ticker}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!validateRes.ok) {
        // Finnhub (via our backend) couldn't find the ticker.
        throw new Error(`Ticker ${ticker} not found or is invalid.`);
      }
      // --- END VALIDATION STEP ---

      // If validation passed, update toast and add to watchlist
      toast.loading(`Adding ${ticker} to watchlist...`, { id: toastId });

      const res = await fetch(`${API_URL}/add_to_watchlist/${ticker}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add stock");
      }
      
      // Success!
      toast.success(`${ticker} added to watchlist!`, { id: toastId });
      // Optimistically update the ticker list to trigger our data-fetching effect
      setTickerList((prevTickers) => [...prevTickers, ticker]);

    } catch (error: any) { //
      console.error("Error adding stock: ", error);
      // This will now show "Ticker NVDI not found..."
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
      // (This is the only direct FS call we still make)
      const stockDocRef = doc(db, "users", user.uid, "watchlist", ticker);
      await deleteDoc(stockDocRef);

      // Success!
      toast.success(`${ticker} removed from watchlist.`, { id: toastId });
      // Update the ticker list to trigger data re-fetch
      setTickerList((prevTickers) => prevTickers.filter(t => t !== ticker));

    } catch (error) {
      console.error("Error removing stock: ", error);
      toast.error(`Failed to remove ${ticker}.`, { id: toastId });
    }
  };

  // --- Inline Form Handler (No Change) ---
  const handleInlineAdd = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddStock(newTicker);
    setNewTicker("");
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

        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-4xl font-semibold text-foreground">
              Your Watchlist
            </h2>
          </div>
          {!isFetchingData && (
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
                  className="absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleRemoveStock(stock.ticker)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
            <h2 className="text-2xl font-medium text-foreground">
              Your watchlist is empty.
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add stocks to your watchlist to start tracking them.
            </p>
            <form
              onSubmit={handleInlineAdd}
              className="mt-6 flex w-full max-w-sm items-center space-x-2"
            >
              <Input
                placeholder="Enter ticker (e.g., AAPL)"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
              />
              <Button type="submit">Add Stock</Button>
            </form>
          </div>
        )}
      </motion.main>
    </div>
  );
}