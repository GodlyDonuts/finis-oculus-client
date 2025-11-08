"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react"; //
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
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  BarChart3,
  Users,
} from "lucide-react"; //
import { StockDetailPageSkeleton } from "@/components/StockDetailPageSkeleton"; //

// --- Richer Mock Data ---
const mockStockDetails = {
  ticker: "AAPL",
  name: "Apple Inc.",
  price: 189.99,
  change: "+1.20 (0.64%)",
  changeType: "positive",
  aiSummary:
    "AAPL shows strong positive sentiment driven by new product announcements and analyst upgrades, though concerns about supply chain remain a minor counter-point.",
  priceHistory: [
    { name: "Jan", price: 150 },
    { name: "Feb", price: 155 },
    { name: "Mar", price: 160 },
    { name: "Apr", price: 158 },
    { name: "May", price: 165 },
    { name: "Jun", price: 180 },
    { name: "Jul", price: 190 },
  ],
  sentiment: {
    score: 0.82,
    label: "Strongly Positive",
    history: [
      { name: "Jan", score: 0.4 },
      { name: "Feb", score: 0.5 },
      { name: "Mar", score: 0.3 },
      { name: "Apr", score: 0.6 },
      { name: "May", score: 0.8 },
      { name: "Jun", score: 0.7 },
      { name: "Jul", score: 0.82 },
    ],
  },
  recentNews: [
    {
      id: 1,
      headline: "Apple Announces New 'Apple Intelligence' Features",
      source: "MarketWatch",
      timestamp: "2 hours ago",
      sentiment: "positive",
    },
    {
      id: 2,
      headline: "Analysts Upgrade AAPL Stock to 'Strong Buy'",
      source: "Reuters",
      timestamp: "5 hours ago",
      sentiment: "positive",
    },
    {
      id: 3,
      headline: "Minor Supply Chain Delays Reported in China",
      source: "Bloomberg",
      timestamp: "1 day ago",
      sentiment: "negative",
    },
  ],
  keyStats: {
    "Market Cap": "2.9T",
    "P/E Ratio": "30.2",
    "Dividend Yield": "0.54%",
    "52 Week High": "199.62",
    "52 Week Low": "164.08",
  },
  //
  aiInsights: [
    {
      id: 1,
      insight:
        "Positive sentiment is 82% correlated with recent 'Apple Intelligence' news flow.",
      type: "correlation",
    },
    {
      id: 2,
      insight: "Price movement shows potential resistance near $192.50.",
      type: "technical",
    },
    {
      id: 3,
      insight:
        "Social media volume is 25% higher than average, indicating high retail interest.",
      type: "social",
    },
  ],
};
// --- End Mock Data ---

// Helper for news icons
const NewsSentimentIcon = ({ sentiment }: { sentiment: string }) => {
  if (sentiment === "positive") {
    return <TrendingUp className="h-4 w-4 flex-shrink-0 text-green-500" />;
  }
  if (sentiment === "negative") {
    return <TrendingDown className="h-4 w-4 flex-shrink-0 text-red-500" />;
  }
  return <Minus className="h-4 w-4 flex-shrink-0 text-gray-500" />;
};

//
const insightIconMap = {
  correlation: Zap,
  technical: BarChart3,
  social: Users,
};

export default function StockDetailPage() {
  const params = useParams();
  const ticker = (params.ticker as string).toUpperCase();

  // --- State Management ---
  const [isLoading, setIsLoading] = useState(true); //
  const [stockData, setStockData] =
    useState<typeof mockStockDetails | null>(null); //
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null); //
  const [hoveredChange, setHoveredChange] = useState<string | null>(null); //
  const [flashKey, setFlashKey] = useState(0); //

  // --- Data Loading & Simulation ---
  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setStockData(mockStockDetails);
      setIsLoading(false);
    }, 1000); // Simulate 1 second load
    return () => clearTimeout(timer);
  }, []);

  // Real-time update simulation
  useEffect(() => {
    if (!stockData) return; // Don't run simulation if data isn't loaded

    const intervalId = setInterval(() => {
      setStockData((prevData) => {
        if (!prevData) return null;
        const newPrice =
          prevData.price + (Math.random() - 0.5) * 0.5; //
        const newChangeVal = newPrice - prevData.priceHistory[0].price;
        const newChangePct = (newChangeVal / prevData.priceHistory[0].price) * 100;

        return {
          ...prevData,
          price: newPrice,
          change: `${
            newChangeVal > 0 ? "+" : ""
          }${newChangeVal.toFixed(2)} (${newChangePct.toFixed(2)}%)`,
          changeType: newChangeVal > 0 ? "positive" : "negative",
        };
      });
      setFlashKey((k) => k + 1); //
    }, 3000); // Update every 3 seconds

    return () => clearInterval(intervalId); //
  }, [stockData]); // Re-run if stockData reference changes (which it does)

  // --- Chart Hover Handlers ---
  const handleChartHover = (e: any) => {
    if (e.activePayload && e.activePayload.length > 0) {
      const payload = e.activePayload[0].payload;
      setHoveredPrice(payload.price); //

      // Calculate change relative to opening price
      if (stockData) {
        const openingPrice = stockData.priceHistory[0].price;
        const changeVal = payload.price - openingPrice;
        const changePct = (changeVal / openingPrice) * 100;
        const changeStr = `${
          changeVal > 0 ? "+" : ""
        }${changeVal.toFixed(2)} (${changePct.toFixed(2)}%)`;
        setHoveredChange(changeStr);
      }
    }
  };

  const handleChartMouseLeave = () => { //
    setHoveredPrice(null);
    setHoveredChange(null);
  };

  // --- Render Logic ---
  if (isLoading || !stockData) { //
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <StockDetailPageSkeleton />
      </div>
    );
  }

  const data = stockData; //
  const priceColor =
    data.changeType === "positive" ? "text-green-500" : "text-red-500";
  const sentimentColor =
    data.sentiment.score > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto p-8"
      >
        <header className="mb-8">
          <h1 className="font-serif-display text-5xl font-semibold text-foreground">
            {data.name} ({data.ticker})
          </h1>
          <div className="mt-2 flex items-baseline gap-4">
            {/* */}
            <motion.span
              key={flashKey} //
              className={`text-4xl font-bold ${
                flashKey > 0 ? "flash-green" : "" //
              }`}
              initial={{ opacity: 0 }} //
              animate={{ opacity: 1 }} //
              transition={{ duration: 0.5 }} //
            >
              {hoveredPrice ? `$${hoveredPrice.toFixed(2)}` : `$${data.price.toFixed(2)}`}
            </motion.span>
            <span className={`text-2xl font-medium ${priceColor}`}>
              {hoveredChange ?? data.change}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* --- Main Content (Left) --- */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {data.aiSummary}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Price Chart</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="opacity-50">
                      1M
                    </Button>
                    <Button variant="ghost" size="sm">
                      6M
                    </Button>
                    <Button variant="ghost" size="sm" className="opacity-50">
                      1Y
                    </Button>
                    <Button variant="ghost" size="sm" className="opacity-50">
                      All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.priceHistory}
                      margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                      onMouseMove={handleChartHover} //
                      onMouseLeave={handleChartMouseLeave} //
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
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} tickFormatter={(val) => `$${val}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value: number) => [
                          `$${value.toFixed(2)}`,
                          "Price",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment-Driving News</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {data.recentNews.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <NewsSentimentIcon sentiment={item.sentiment} />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium leading-tight text-foreground">
                        {item.headline}
                      </p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{item.source}</span>
                        <span>&middot;</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* --- Sidebar (Right) --- */}
          <div className="flex flex-col gap-8 lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>AI Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                {/* */}
                <motion.p
                  className={`text-5xl font-bold ${sentimentColor}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {data.sentiment.score > 0 ? "+" : ""}
                  {data.sentiment.score.toFixed(2)}
                </motion.p>
                <p className="text-xl text-muted-foreground">
                  {data.sentiment.label}
                </p>
                <div className="mt-6 h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.sentiment.history}
                      margin={{ top: 5, right: 0, left: -30, bottom: 5 }}
                    >
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                        formatter={(value: number) => [
                          value.toFixed(2),
                          "Score",
                        ]}
                      />
                      <Bar
                        dataKey="score"
                        fill="hsl(var(--primary))"
                        opacity={0.6}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {Object.entries(data.keyStats).map(([key, value]) => (
                    <li
                      key={key}
                      className="flex justify-between border-b border-dashed border-border/50 pb-2 text-sm"
                    >
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-foreground">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* --- AI-Generated Insights Card --- */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-4">
                  {data.aiInsights.map((item) => {
                    const Icon =
                      insightIconMap[
                        item.type as keyof typeof insightIconMap
                      ];
                    return (
                      <li
                        key={item.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">
                          {item.insight}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
            {/* --- End AI Insights --- */}
          </div>
        </div>
      </motion.main>
    </div>
  );
}