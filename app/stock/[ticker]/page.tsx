// app/stock/[ticker]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authcontext";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/Header";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  BarChart, // Added BarChart
  Bar, // Added Bar
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  BarChart3,
  Users,
  Newspaper,
  Scale,
  BrainCircuit,
} from "lucide-react";
import { StockDetailPageSkeleton } from "@/components/StockDetailPageSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FinancialScorecard } from "@/components/FinancialScorecard";
import { TechnicalAnalysis } from "@/components/TechnicalAnalysis";
import { PremiumGate } from "@/components/PremiumGate";

// ... (Existing Type Definitions)

type PriceHistoryPoint = {
  name: string;
  price: number;
};

// --- NEW/UPDATED TYPE DEFINITION FOR PREMIUM DATA ---
type RatioRating = 'Strong' | 'Neutral' | 'Weak';
type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';

type StockDetailData = {
  ticker: string;
  name: string;
  price: number;
  previousClose: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  aiSummary: string;
  priceHistory: PriceHistoryPoint[];
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
  technicalIndicators: Record<string, { value: number, signal: TechnicalSignal }>;
};
// --- END NEW/UPDATED TYPE DEFINITION ---

type ChartApiResponse = {
  priceHistory: PriceHistoryPoint[];
  price: number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
}

const chartRanges = ['1D', '1W', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'];

// ... (NewsSentimentIcon and insightIconMap remain the same)

const NewsSentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment === "positive") {
    return <TrendingUp className="h-5 w-5 flex-shrink-0 text-green-500" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="h-5 w-5 flex-shrink-0 text-red-500" />;
  }
  return <Minus className="h-5 w-5 flex-shrink-0 text-gray-500" />;
};

const insightIconMap = {
  correlation: Zap,
  technical: BarChart3,
  social: Users,
};

export default function StockDetailPage() {
  const params = useParams();
  const ticker = (params?.ticker as string)?.toUpperCase() || "";
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState<StockDetailData | null>(null);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [hoveredChange, setHoveredChange] = useState<string | null>(null);
  const [hoveredChangeType, setHoveredChangeType] = useState<
    "positive" | "negative" | "neutral"
  >("neutral");

  const [activeRange, setActiveRange] = useState('6M');
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  
  // --- NEW STATE FOR PRICE ANIMATION ---
  const [prevPrice, setPrevPrice] = useState(0);
  const [flashClass, setFlashClass] = useState("");
  // --- END NEW STATE ---

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
        setStockData(data);
        setPriceHistory(data.priceHistory || []);
        // Initialize prevPrice on first load
        setPrevPrice(data.price); 

      } catch (error: any) {
        console.error("Failed to fetch stock details:", error);
        toast.error(`Could not load data for ${ticker}: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetails();

  }, [user, ticker]);

  // --- NEW useEffect for Price Flash Animation ---
  useEffect(() => {
    if (stockData && stockData.price !== prevPrice && prevPrice !== 0) {
        if (stockData.price > prevPrice) {
            setFlashClass("flash-green");
        } else if (stockData.price < prevPrice) {
            setFlashClass("flash-red");
        }
        
        // Update prevPrice AFTER determining the flash class
        setPrevPrice(stockData.price);

        // Remove the class after the animation (1s defined in globals.css)
        const timer = setTimeout(() => {
            setFlashClass("");
        }, 1000);

        return () => clearTimeout(timer);
    }
    if (stockData && prevPrice === 0) {
        setPrevPrice(stockData.price);
    }
  }, [stockData, prevPrice]);
  // --- END NEW useEffect ---

  const handleRangeChange = async (range: string) => {
    if (range === activeRange) return;
    setActiveRange(range);
    setIsChartLoading(true);

    try {
      const res = await fetch(`/api/stock-chart/${ticker}?range=${range}`);
      if (!res.ok) {
        throw new Error('Failed to load chart data');
      }
      const data: ChartApiResponse = await res.json();
      
      setPriceHistory(data.priceHistory);

      setStockData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          price: data.price,
          change: data.change,
          changeType: data.changeType,
        };
      });

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsChartLoading(false);
    }
  };

  const getHoverChange = (price: number, base: number) => {
    if (!price || !base) return { text: "-", type: "neutral" };
    const changeVal = price - base;
    const changePct = (changeVal / base) * 100;
    const type =
      changeVal > 0 ? "positive" : changeVal < 0 ? "negative" : "neutral";
    const text = `${changeVal > 0 ? "+" : ""}${changeVal.toFixed(
      2
    )} (${changePct.toFixed(2)}%)`;
    return { text, type };
  };

  const handleChartHover = (e: any) => {
    if (
      e &&
      e.activeTooltipIndex != null &&
      priceHistory[e.activeTooltipIndex] &&
      stockData
    ) {
      const payload = priceHistory[e.activeTooltipIndex];
      const price = payload.price;
      const { text, type } = getHoverChange(
        price,
        stockData.previousClose
      );
      setHoveredPrice(price);
      setHoveredChange(text);
      setHoveredChangeType(type);
    }
  };

  const handleChartMouseLeave = () => {
    setHoveredPrice(null);
    setHoveredChange(null);
    setHoveredChangeType("neutral");
  };

  if (isLoading || !stockData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <StockDetailPageSkeleton />
      </div>
    );
  }

  const data = stockData;
  const priceColor =
    hoveredPrice
      ? hoveredChangeType === "positive"
        ? "text-green-500"
        : hoveredChangeType === "negative"
        ? "text-red-500"
        : "text-foreground"
      : data.changeType === "positive"
      ? "text-green-500"
      : data.changeType === "negative"
      ? "text-red-500"
      : "text-foreground";
  
  const sentimentColor =
    data.sentiment?.score > 0
      ? "text-green-500"
      : data.sentiment?.score < 0
      ? "text-red-500"
      : "text-gray-500";
  
  const sentimentBorderColor =
    data.sentiment?.score > 0
      ? "border-green-500/30"
      : data.sentiment?.score < 0
      ? "border-red-500/30"
      : "border-border/50";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto p-8"
      >
        <header className="mb-4">
          <h1 className="font-serif-display text-5xl font-semibold text-foreground">
            {data.name || ticker}
          </h1>
          <p className="text-xl font-medium text-muted-foreground">
             {ticker}
          </p>
        </header>

        {/* --- NEW: Animated Price Bar --- */}
        <motion.div 
            key={flashClass} 
            className={cn(
                "mb-8 flex items-baseline gap-6 rounded-2xl p-6 transition-all duration-1000",
                flashClass, // Applies the flash-green/red animation
                "border border-border/50 bg-card shadow-lg" // Card-like appearance
            )}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <span className={cn("text-6xl font-extrabold tracking-tight", priceColor)}>
                {hoveredPrice
                    ? `$${hoveredPrice.toFixed(2)}`
                    : `$${data.price?.toFixed(2) ?? "N/A"}`}
            </span>
            <span className={cn("text-3xl font-semibold", priceColor)}>
                {hoveredChange ? hoveredChange : data.change ?? "-"}
            </span>
        </motion.div>
        {/* --- END NEW PRICE BAR --- */}


        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Main Content (Left, 2/3rds) --- */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            
            {/* Price Chart Card (Remains Top Priority) */}
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Price History</CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {chartRanges.map((range) => (
                      <Button
                        key={range}
                        variant={activeRange === range ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleRangeChange(range)}
                        disabled={isChartLoading}
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                  <div className="h-96 w-full">
                    {isChartLoading ? (
                      <Skeleton className="h-96 w-full rounded-lg" />
                    ) : (
                      priceHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={priceHistory}
                            onMouseMove={handleChartHover}
                            onMouseLeave={handleChartMouseLeave}
                          >
                            <defs>
                              <linearGradient
                                id="priceGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--primary))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis
                              fontSize={12}
                              tickFormatter={(val) => `$${val}`}
                              domain={['auto', 'auto']}
                              axisLine={false}
                              tickLine={false}
                              width={50}
                            />
                            <Tooltip
                              content={<CustomTooltip />}
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke="hsl(var(--primary))"
                              strokeWidth={2}
                              fill="url(#priceGradient)"
                              activeDot={{
                                r: 6,
                                stroke: "hsl(var(--primary))",
                                strokeWidth: 2,
                                fill: "hsl(var(--background))",
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No price data available for this range.
                        </div>
                      )
                    )}
                  </div>
              </CardContent>
            </Card>
            
            {/* --- NEW: Consolidated Info Grid (AI Summary & News) --- */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* AI Summary Card (Left Column of sub-grid) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base leading-relaxed text-muted-foreground">
                            {data.aiSummary || 'No analysis available.'}
                        </p>
                    </CardContent>
                </Card>
                
                {/* Sentiment-Driving News (Right Column of sub-grid) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Sentiment-Driving News</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {(data.recentNews || []).length > 0 ? (
                            (data.recentNews || []).slice(0, 4).map((item) => ( // Limit to 4 for better aesthetic
                                <div key={item.id} className="flex items-start gap-3 border-b border-border/50 pb-4 last:border-b-0 last:pb-0">
                                    <NewsSentimentIcon sentiment={item.sentiment} />
                                    <div className="flex flex-col gap-0.5">
                                        <p className="font-medium leading-snug text-foreground">
                                            {item.headline}
                                        </p>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            <span>{item.source}</span>
                                            <span>&middot;</span>
                                            <span>{item.timestamp.split(',')[0]}</span> {/* Use only date part */}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center gap-3 py-4 text-center">
                                <Newspaper className="h-8 w-8 text-muted-foreground" />
                                <p className="font-medium text-muted-foreground text-sm">No recent news found.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </div>

          {/* --- Sidebar (Right, 1/3rd) - Premium Focused --- */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            
            {/* AI Sentiment Card (Top Priority in Sidebar) */}
            <Card className={cn("border-2", sentimentBorderColor)}>
              <CardHeader>
                <CardTitle>AI Sentiment Score</CardTitle>
                <CardDescription>Based on real-time news and social volume analysis.</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.p
                  className={cn("text-7xl font-bold tracking-tight", sentimentColor)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {data.sentiment?.score > 0 ? "+" : ""}
                  {data.sentiment?.score?.toFixed(2) ?? 'N/A'}
                </motion.p>
                <p className="text-2xl font-medium text-muted-foreground">
                  {data.sentiment?.label ?? 'No Data'}
                </p>
                {/* Sentiment History Bar Chart */}
                <div className="mt-6 h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.sentiment?.history || []}
                      margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                    >
                      <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis fontSize={12} domain={['auto', 'auto']} axisLine={false} tickLine={false} />
                      <Tooltip
                        content={<CustomTooltip isBarChart={true} />}
                      />
                      <Bar
                        dataKey="score"
                        fill="hsl(var(--primary))"
                        opacity={0.6}
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI-Generated Insights (Grouped with Sentiment) */}
            <Card>
              <CardHeader>
                <CardTitle>Top AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-4">
                  {(data.aiInsights || []).length > 0 ? (
                    (data.aiInsights || []).map((item) => {
                      const Icon =
                        insightIconMap[
                          item.type as keyof typeof insightIconMap
                        ] || Zap;
                      return (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 text-base"
                        >
                          <Icon className="h-5 w-5 flex-shrink-0 text-primary mt-1" />
                          <span className="text-foreground leading-snug">
                            {item.insight}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No AI insights generated yet.</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* PREMIUM FINANCIALS & TECHNICALS */}
            <PremiumGate featureName="Technical & Financial Analysis">
              <TechnicalAnalysis indicators={data.technicalIndicators} />
              <FinancialScorecard ratios={data.financialRatios} />
            </PremiumGate>

            {/* KEY STATS (Moved to the bottom) */}
            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {Object.entries(data.keyStats || {}).length > 0 ? (
                    Object.entries(data.keyStats || {}).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col"
                      >
                        <span className="text-sm text-muted-foreground">{key}</span>
                        <span className="text-lg font-semibold text-foreground">
                          {value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-muted-foreground">No key statistics available.</p>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </motion.main>
    </div>
  );
}

// --- Custom Tooltip Component (Remains the same) ---
const CustomTooltip = ({
  active,
  payload,
  label,
  isBarChart = false,
}: TooltipProps<number, string> & { isBarChart?: boolean }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background/90 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-base font-bold text-primary">
          {isBarChart
            ? `Score: ${payload[0].value?.toFixed(2)}`
            : `$${payload[0].value?.toFixed(2)}`
          }
        </p>
      </div>
    );
  }

  return null;
};
// --- END Custom Tooltip Component ---