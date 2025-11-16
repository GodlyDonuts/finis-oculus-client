// app/stock/[ticker]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import { StockDetailPageSkeleton } from "@/components/StockDetailPageSkeleton";
import { StockDetailHero } from "@/components/StockDetailHero"; // NEW
import { OculusPrismSidebar } from "@/components/OculusPrismSidebar"; // NEW
import { StockDetailWorkbench } from "@/components/StockDetailWorkbench"; // NEW

// --- This type definition will need to be expanded ---
// --- based on our API enhancements (see Phase 4) ---
type RatioRating = 'Strong' | 'Neutral' | 'Weak';
type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';

type StockDetailData = {
  ticker: string;
  name: string;
  exchange: string; // NEW - Needs API change
  logoUrl: string; // NEW - Needs API change
  price: number;
  previousClose: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  // --- Data for Market State (NEEDS API CHANGE) ---
  marketState: "OPEN" | "CLOSED" | "PRE" | "POST";
  preMarketPrice?: number;
  preMarketChange?: string;
  postMarketPrice?: number;
  postMarketChange?: string;
  // --- End Market State ---
  aiSummary: string;
  priceHistory: { name: string; price: number; volume?: number }; // Added volume
  sentiment: {
    score: number;
    label: string;
    history: { name: string; score: number }[];
  };
  recentNews: {
    id: string | number;
    headline: string;
    source: string;
    timestamp: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  keyStats: Record<string, string>;
  aiInsights: {
    id: string | number;
    insight: string;
    type: "correlation" | "technical" | "social";
  }[];
  financialRatios: Record<string, { value: string | number, rating: RatioRating }>;
  technicalIndicators: Record<string, { value: number | string, signal: TechnicalSignal }>;
  // --- NEW Data (NEEDS API CHANGE) ---
  analystRatings: {
    recommendation: string; // e.g., "Strong Buy"
    targetPrice: number;
    distribution: { rating: string, count: number }[]; // e.g., [{ rating: "Buy", count: 10 }, ...]
  };
  companyProfile: {
    description: string;
    industry: string;
    sector: string;
    executives: { name: string, title: string }[];
    location: string;
    website: string;
  };
  financialStatements: { // This is a major API addition
    annual: any; // Stubbed
    quarterly: any; // Stubbed
  };
};
// --- END TYPE DEFINITION ---


export default function StockDetailPage() {
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() || "";
  const { user, isPremium } = useAuth(); // Get isPremium
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState<StockDetailData | null>(null);

  useEffect(() => {
    if (!user || !ticker) {
      return;
    }

    const fetchStockDetails = async () => {
      setIsLoading(true);
      try {
        // We will need to update this API route
        const res = await fetch(`/api/stock-details/${ticker}`);

        if (!res.ok) {
          // --- FIX: RESTORED ORIGINAL .text() ERROR HANDLING ---
          let errorMessage = `Server error (${res.status})`;
          try {
            const errorBody = await res.text(); // Use .text()
            if (errorBody && errorBody.startsWith('{')) {
              const errorJson = JSON.parse(errorBody);
              errorMessage = errorJson.error || errorMessage;
            } else if (errorBody) {
              errorMessage = `Server error: ${res.statusText}`;
            }
          } catch (e) {
            errorMessage = `Server error: ${res.statusText}`;
          }
          throw new Error(errorMessage);
          // --- END FIX ---
        }

        const data: StockDetailData = await res.json();
        setStockData(data);

      } catch (error: any) { // <--- FIX: Added {
        console.error("Failed to fetch stock details:", error);
        toast.error(`Could not load data for ${ticker}: ${error.message}`);
      } finally { // <--- FIX: Added } before finally
        setIsLoading(false);
      }
    };

    fetchStockDetails();

  }, [user, ticker]);


  if (isLoading || !stockData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        {/* Use the new, matching skeleton */}
        <StockDetailPageSkeleton />
      </div>
    );
  }

  const data = stockData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto p-8"
      >
        {/* Zone 1: The "Hero" Header */}
        <StockDetailHero
          ticker={data.ticker}
          name={data.name}
          exchange={data.exchange} // Needs API
          logoUrl={data.logoUrl} // Needs API
          price={data.price}
          change={data.change}
          changeType={data.changeType}
          marketState={data.marketState} // Needs API
          // ... (pass other pre/post market props)
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Zone 3: The "Workbench" (Main Area) */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <StockDetailWorkbench
              ticker={ticker}
              priceHistory={data.priceHistory}
              sentimentHistory={data.sentiment.history}
              technicalIndicators={data.technicalIndicators}
              aiSummary={data.aiSummary}
              aiInsights={data.aiInsights}
              recentNews={data.recentNews}
              financialRatios={data.financialRatios}
              financialStatements={data.financialStatements} // Needs API
              companyProfile={data.companyProfile} // Needs API
              isPremium={isPremium}
            />
          </div>

          {/* Zone 2: The "Oculus Prism" Sidebar */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <OculusPrismSidebar
              sentiment={data.sentiment}
              financialRatios={data.financialRatios}
              technicalIndicators={data.technicalIndicators}
              keyStats={data.keyStats}
              analystRatings={data.analystRatings} // Needs API
            />
          </div>

        </div>
      </motion.main>
    </div>
  );
}