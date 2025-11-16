// app/stock/[ticker]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
// Skeleton page is GONE.
import { StockDetailHero } from "@/components/StockDetailHero";
import { OculusPrismSidebar } from "@/components/OculusPrismSidebar";
import { StockDetailWorkbench } from "@/components/StockDetailWorkbench";
import { cn } from "@/lib/utils"; // Import cn for the Oculus Glow

// --- Kinetix: Event & Pattern Types for "Living Chart" ---
export type EventMarker = {
  date: string | number; // Must match the x-axis data type (e.g., "Oct 20")
  label: string;
  link?: string;
};

export type AiPattern = {
  type: string; // e.g., "Golden Cross"
  description: string;
  // This is simplified; a real implementation would be more complex
  points: { name: string | number; value: number }[];
};
// --- End Kinetix Types ---

// --- Type Definition (Expanded for Kinetix) ---
type RatioRating = 'Strong' | 'Neutral' | 'Weak';
type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';

export type StockDetailData = {
  ticker: string;
  name: string;
  exchange: string;
  logoUrl: string;
  price: number;
  previousClose: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  marketState: "OPEN" | "CLOSED" | "PRE" | "POST";
  preMarketPrice?: number;
  preMarketChange?: string;
  postMarketPrice?: number;
  postMarketChange?: string;
  aiSummary: string;
  priceHistory: { name: string; price: number; volume?: number };
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
    // Kinetix: Natural Language
    timestamp: string; // e.g., "10:47 AM"
    naturalLanguage: string; // The new human-readable insight
  }[];
  financialRatios: Record<string, { value: string | number, rating: RatioRating }>;
  technicalIndicators: Record<string, { value: number | string, signal: TechnicalSignal }>;
  analystRatings: {
    recommendation: string;
    targetPrice: number;
    distribution: { rating: string, count: number }[];
  };
  companyProfile: {
    description: string;
    industry: string;
    sector: string;
    executives: { name: string, title: string }[];
    location: string;
    website: string;
  };
  financialStatements: {
    annual: any;
    quarterly: any;
  };

  // --- Kinetix: Data for "Living Chart" ---
  // These would be fetched from the API
  newsEvents: EventMarker[];
  secFilings: EventMarker[];
  sentimentSpikes: EventMarker[];
  aiPatterns: AiPattern[];
};
// --- END TYPE DEFINITION ---


export default function StockDetailPage() {
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() || "";
  const { user, isPremium } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState<StockDetailData | null>(null);

  // --- Kinetix: State for Adaptive Layout ---
  type LayoutMode = "briefing" | "cockpit" | "debrief";
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("briefing");

  // --- Kinetix: Effect to set LayoutMode from Market State ---
  useEffect(() => {
    if (stockData?.marketState) {
      switch (stockData.marketState) {
        case "PRE":
          setLayoutMode("briefing");
          break;
        case "OPEN":
          setLayoutMode("cockpit");
          break;
        case "POST":
        case "CLOSED":
          setLayoutMode("debrief");
          break;
        default:
          setLayoutMode("debrief"); // Default to debrief
      }
    }
  }, [stockData?.marketState]);


  useEffect(() => {
    if (!user || !ticker) {
      return;
    }

    const fetchStockDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/stock-details/${ticker}`);

        if (!res.ok) {
          let errorMessage = `Server error (${res.status})`;
          try {
            const errorBody = await res.text();
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
        }

        const data: StockDetailData = await res.json();
        
        // --- Mock Kinetix Data (for demo) ---
        data.newsEvents = [
          { date: data.priceHistory[30]?.name, label: "CEO Interview" },
          { date: data.priceHistory[50]?.name, label: "New Product Launch" }
        ];
        data.aiPatterns = [
          { 
            type: "Golden Cross", 
            description: "AI detected a Golden Cross pattern.",
            points: [
              { name: data.priceHistory[10]?.name, value: data.priceHistory[10]?.price * 1.02 },
              { name: data.priceHistory[60]?.name, value: data.priceHistory[60]?.price * 0.98 }
            ]
          }
        ];
        data.aiInsights[0] = {
          ...data.aiInsights[0],
          timestamp: "10:47 AM",
          naturalLanguage: "[10:47 AM] Our AI has identified a \"Golden Cross\" on the 50/200-day chart. In 72% of historical cases for this stock, this pattern has led to a median 8.5% gain over the following 30 days."
        };
        // --- End Mock Data ---

        setStockData(data);

      } catch (error: any) {
        console.error("Failed to fetch stock details:", error);
        toast.error(`Could not load data for ${ticker}: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetails();

  }, [user, ticker]);


  // --- Kinetix: "Calm Loading" Implementation ---
  // The skeleton page is GONE. We render the layout immediately
  // and pass `stockData` (which is `null` on first render) to the
  // children. They are now responsible for their own loading states.

  // --- Kinetix: Define layout order based on mode ---
  const oculusGlowClass = "oculus-glow border-primary/60"; // The brand glow

  const hero = (
    <div className={cn(layoutMode === 'cockpit' && oculusGlowClass, "transition-all duration-500")}>
      <StockDetailHero data={stockData} />
    </div>
  );
  
  const workbench = (
    <div className={cn(layoutMode === 'debrief' && oculusGlowClass, "transition-all duration-500")}>
      <StockDetailWorkbench
        data={stockData}
        isPremium={isPremium}
        defaultTab={layoutMode === 'briefing' ? 'insights' : layoutMode === 'debrief' ? 'news' : 'chart'}
        // Pass "Living Chart" data
        newsEvents={stockData?.newsEvents || []}
        aiPatterns={stockData?.aiPatterns || []}
      />
    </div>
  );

  const sidebar = (
    <div className={cn(layoutMode === 'briefing' && oculusGlowClass, "transition-all duration-500")}>
      <OculusPrismSidebar data={stockData} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-8"
      >
        {/* Zone 1: The "Hero" Header */}
        {/* Kinetix: Render order is now dynamic */}
        {layoutMode === 'cockpit' && (
          <div className="mb-8">{hero}</div> // Hero expands to full width
        )}
        
        {layoutMode !== 'cockpit' && hero}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Kinetix: Adaptive Layout Rendering */}
          {layoutMode === 'briefing' && (
            <>
              <div className="flex flex-col gap-8 lg:col-span-2">{workbench}</div>
              <div className="flex flex-col gap-8 lg:col-span-1">{sidebar}</div>
            </>
          )}

          {layoutMode === 'cockpit' && (
            <>
              <div className="flex flex-col gap-8 lg:col-span-2">{workbench}</div>
              <div className="flex flex-col gap-8 lg:col-span-1">{sidebar}</div>
            </>
          )}

          {layoutMode === 'debrief' && (
            <>
              <div className="flex flex-col gap-8 lg:col-span-2">{workbench}</div>
              <div className="flex flex-col gap-8 lg:col-span-1">{sidebar}</div>
            </>
          )}
          {/* Note: The layout re-ordering (e.g., sidebar first) could be
              implemented by changing the order of these elements.
              For simplicity, we've kept the L/R split but changed
              the default tabs and "Oculus Glow" focus.
          */}

        </div>
      </motion.main>
    </div>
  );
}