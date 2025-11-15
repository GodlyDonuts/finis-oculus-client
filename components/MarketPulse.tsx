/*
  File: components/MarketPulse.tsx
  Purpose: Implements SECTION 2: THE "MARKET PULSE".
  Replaces the old "Market Overview" with AI-powered indices and new tabs.
*/
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const marketPulseData = [
  {
    name: "S&P 500",
    value: "5,432.10",
    change: "+0.5%",
    changeType: "positive",
    icon: TrendingUp,
    sentiment: "Neutral (-0.02)",
    sentimentColor: "text-gray-500",
  },
  {
    name: "NASDAQ",
    value: "17,650.80",
    change: "+1.2%",
    changeType: "positive",
    icon: TrendingUp,
    sentiment: "Positive (+0.15)",
    sentimentColor: "text-green-500",
  },
  {
    name: "DOW 30",
    value: "39,112.50",
    change: "-0.2%",
    changeType: "negative",
    icon: TrendingDown,
    sentiment: "Negative (-0.11)",
    sentimentColor: "text-red-500",
  },
];

export function MarketPulse() {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif-display text-4xl font-semibold text-foreground">
        Market Pulse
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {marketPulseData.map((index) => {
          const priceColor =
            index.changeType === "positive"
              ? "text-green-500"
              : "text-red-500";
          const Icon = index.icon;
          return (
            <Card
              key={index.name}
              className="border-2 border-border/50 bg-card/70 backdrop-blur-sm transition-all hover:border-primary/50"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  {index.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-semibold">{index.value}</p>
                  <Icon className={cn("h-6 w-6", priceColor)} />
                </div>
                <p className={cn("text-sm font-medium", priceColor)}>
                  {index.change}
                </p>
                {/* AI-Powered Indices [cite: 211, 212] */}
                <p
                  className={cn(
                    "mt-2 text-sm font-semibold",
                    index.sentimentColor
                  )}
                >
                  AI Sentiment: {index.sentiment}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Placeholder for new tabs [cite: 215, 216] and heatmap[cite: 213, 214].
        This would be built out using <Tabs> and a new <SentimentHeatmap /> component.
      */}
    </section>
  );
}