// app/dashboard/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/authcontext";
import { Header } from "@/components/Header";
import StockCard from "@/components/StockCard";
import { StockCardSkeleton } from "@/components/StockCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
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
import { db } from "@/firebase/config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  LayoutGrid,
  List,
  AppWindow,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// --- NEW Components ---
import { DailyBriefing } from "@/components/DailyBriefing";
import { MarketPulse } from "@/components/MarketPulse";
import { OculusAiFeed } from "@/components/OculusAiFeed";
import { WelcomeModal } from "@/components/WelcomeModal";
import { CommandPalette } from "@/components/CommandPalette";
import { HeroVisual } from "@/components/HeroVisual";

// This is the data type our StockCard component expects
type Stock = {
  ticker: string;
  name: string;
  price: number | null; // Allows for null prices
  sentiment: number;
  sparkline: number[];
  aiSignal: "BUY" | "SELL" | "HOLD";
};

// Get the API URL from the environment
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const { user, loading: authLoading, isPremium } = useAuth();
  const router = useRouter();

  const [isInitializing, setIsInitializing] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [tickerList, setTickerList] = useState<string[]>([]);
  const [watchlistData, setWatchlistData] = useState<Stock[]>([]);
  const [newTicker, setNewTicker] = useState("");
  const [isInlineValidating, setIsInlineValidating] = useState(false);

  // --- NEW State ---
  const [watchlistView, setWatchlistView] = useState("grid");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // --- NEW: Command Palette Key Listener ---
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // --- Auth Protection ---
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        setIsInitializing(false);
      }
    }
  }, [user, authLoading, router]);

  // --- Data Fetching Function ---
  const fetchWatchlistData = useCallback(async () => {
    if (!user) return;
    setIsFetchingData(true);

    try {
      const watchlistCollection = collection(
        db,
        "users",
        user.uid,
        "watchlist"
      );
      const querySnapshot = await getDocs(watchlistCollection);
      const tickers = querySnapshot.docs.map((doc) => doc.id);

      setTickerList(tickers);

      if (tickers.length === 0) {
        setWatchlistData([]);
        setIsFetchingData(false);
        // --- NEW: Trigger Smarter Onboarding ---
        if (!sessionStorage.getItem("hasSeenWelcomeModal")) {
          setShowWelcomeModal(true);
          sessionStorage.setItem("hasSeenWelcomeModal", "true");
        }
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/get_watchlist_details`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickers: tickers }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch watchlist data");
      }

      const results = await res.json();

      const formattedData = results.map((data: any) => ({
        ticker: data.ticker,
        name: data.ticker,
        price: data.livePrice?.c ?? null, // Pass null if 'c' is missing
        sentiment: data.sentiment?.score ?? 0,
        // Sparkline still needs a number, so '0' is a fine fallback here
        sparkline: Array.from(
          { length: 7 },
          () => Math.random() * 20 + ((data.livePrice?.c ?? 0) - 10)
        ),
        aiSignal: (["BUY", "SELL", "HOLD"] as const)[
          Math.floor(Math.random() * 3)
        ],
      }));

      setWatchlistData(formattedData);
    } catch (error) {
      console.error("Error fetching watchlist data: ", error);
      toast.error("Could not load your watchlist data.");
    } finally {
      setIsFetchingData(false);
    }
  }, [user]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (user) {
      fetchWatchlistData();
    }
  }, [user, fetchWatchlistData]);

  // --- Handle Add Stock ---
  const handleAddStock = async (ticker: string) => {
    if (!user) return;

    const currentCount = tickerList.length;
    if (!isPremium && currentCount >= 15) {
      toast.error("Free Plan Limit Reached", {
        description:
          "Please delete an existing stock or upgrade to Premium to add more.",
      });
      return;
    }

    if (tickerList.includes(ticker)) {
      toast.error(`${ticker} is already in your watchlist.`);
      return;
    }

    const toastId = toast.loading(`Adding ${ticker} to watchlist...`);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/add_to_watchlist/${ticker}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add stock");
      }

      toast.success(`${ticker} added to watchlist!`, { id: toastId });
      fetchWatchlistData(); // Refresh all data
    } catch (error: any) {
      console.error("Error adding stock: ", error);
      toast.error(error.message || `Failed to add ${ticker}.`, { id: toastId });
    }
  };

  // --- Handle Remove Stock ---
  const handleRemoveStock = async (ticker: string) => {
    if (!user) return;

    const toastId = toast.loading(`Removing ${ticker}...`);

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/remove_from_watchlist/${ticker}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to remove stock from backend");
      }

      const stockDocRef = doc(db, "users", user.uid, "watchlist", ticker);
      await deleteDoc(stockDocRef);

      toast.success(`${ticker} removed from watchlist.`, { id: toastId });
      fetchWatchlistData(); // Refresh all data
    } catch (error) {
      console.error("Error removing stock: ", error);
      toast.error(`Failed to remove ${ticker}.`, { id: toastId });
    }
  };

  // --- Inline Form Handler ---
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
      const response = await fetch(`/api/validate/${upperTicker}`);
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || `Invalid ticker: ${upperTicker}`, {
          id: validationToastId,
        });
        return;
      }
      toast.dismiss(validationToastId);
      await handleAddStock(upperTicker);
      setNewTicker("");
    } catch (error) {
      toast.error("Validation failed. Please try again.", {
        id: validationToastId,
      });
      console.error("Validation error:", error);
    } finally {
      setIsInlineValidating(false);
    }
  };

  // --- RENDER LOGIC ---

  if (isInitializing) {
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

  return (
    <div className="min-h-screen bg-background">
      {/* --- NEW: Aurora/Glow Effect --- */}
      <div className="absolute inset-0 z-0 h-full w-full opacity-10 blur-3xl">
        <HeroVisual />
      </div>

      {/* --- NEW: Modals --- */}
      <Header />
      <WelcomeModal open={showWelcomeModal} onOpenChange={setShowWelcomeModal} />
      <CommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onAddStock={handleAddStock}
      />

      {/* --- NEW: Two-Column Layout --- */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container relative z-10 mx-auto p-8"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Main Content Column --- */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* --- SECTION 1: Daily Briefing --- */}
            <DailyBriefing />

            {/* --- SECTION 2: Market Pulse --- */}
            <MarketPulse />

            {/* --- SECTION 3: The Living Watchlist --- */}
            <section>
              <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="font-serif-display text-4xl font-semibold text-foreground">
                    Your Watchlist
                  </h2>
                  <p className="mt-1 text-lg text-muted-foreground">
                    Your personal AI-powered market dashboard.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* View Toggle */}
                  <ToggleGroup
                    type="single"
                    value={watchlistView}
                    onValueChange={(value) => value && setWatchlistView(value)}
                  >
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <LayoutGrid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view" disabled>
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="heatmap"
                      aria-label="Heatmap view"
                      disabled
                    >
                      <AppWindow className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>

                  {!isFetchingData && (
                    <AddStockDialog onStockAdded={handleAddStock} />
                  )}
                </div>
              </header>

              {isFetchingData ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[...Array(tickerList.length || 2)].map((_, i) => (
                    <StockCardSkeleton key={i} />
                  ))}
                </div>
              ) : watchlistData.length > 0 ? (
                // --- NEW: AnimatePresence for Micro-interactions ---
                <motion.div
                  layout
                  className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                  <AnimatePresence>
                    {watchlistData.map((stock) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        key={stock.ticker}
                        className="relative group"
                      >
                        <StockCard
                          ticker={stock.ticker}
                          name={stock.name}
                          price={stock.price}
                          sentiment={stock.sentiment}
                          sparkline={stock.sparkline}
                          aiSignal={stock.aiSignal}
                        />
                        {/* --- NEW: Quick-Action Menu --- */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/stock/${stock.ticker}`)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              Set Alert
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              View Top Insights
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => handleRemoveStock(stock.ticker)}
                            >
                              Remove from Watchlist
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 p-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-input">
                    <LayoutGrid className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h2 className="mt-6 text-2xl font-medium text-foreground">
                    Your watchlist is empty
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
                      onChange={(e) =>
                        setNewTicker(e.target.value.toUpperCase())
                      }
                      className="h-12 flex-1"
                      disabled={isInlineValidating}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isInlineValidating}
                    >
                      {isInlineValidating ? "Checking..." : "Add Stock"}
                    </Button>
                  </form>
                </div>
              )}
            </section>
          </div>

          {/* --- Sidebar Column --- */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            {/* --- SECTION 4: Oculus AI Feed --- */}
            <OculusAiFeed />
          </div>
        </div>
      </motion.main>
    </div>
  );
}