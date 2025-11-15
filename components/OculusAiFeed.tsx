/*
  File: components/OculusAiFeed.tsx
  Purpose: Implements SECTION 4: "OCULUS AI FEED".
  This is the new "Instagram feed" for AI insights.
*/
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, BarChart3, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const feedItems = [
  {
    id: 1,
    time: "10:32 AM",
    ticker: "AAPL",
    insight:
      "AI detected a 40% spike in social media volume, correlating with a -0.15 sentiment drop.",
    icon: Users,
    color: "text-red-500",
  },
  {
    id: 2,
    time: "10:30 AM",
    ticker: "MSFT",
    insight:
      "A new 'Golden Cross' technical signal has formed on the 50/200-day moving average.",
    icon: BarChart3,
    color: "text-green-500",
  },
  {
    id: 3,
    time: "10:28 AM",
    ticker: "TSLA",
    insight:
      "Sentiment-driving news detected: 'Tesla recalls 50,000 vehicles...'",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: 4,
    time: "9:45 AM",
    ticker: "GOOG",
    insight:
      "Unusual options activity detected, suggesting high institutional interest.",
    icon: Sparkles,
    color: "text-primary",
  },
];

export function OculusAiFeed() {
  return (
    <Card className="w-full border-2 border-border/50 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif-display text-2xl">
          <Sparkles className="h-6 w-6 text-primary" />
          Oculus AI Feed
        </CardTitle>
        <CardDescription>
          Real-time insights for your watchlist.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Real-Time Insights Feed [cite: 228, 229] */}
        <div className="flex max-h-[600px] flex-col gap-6 overflow-y-auto pr-2">
          {feedItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-4">
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 translate-y-0.5",
                    item.color
                  )}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    <span className="font-bold">[{item.ticker}]</span>{" "}
                    {item.insight}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}