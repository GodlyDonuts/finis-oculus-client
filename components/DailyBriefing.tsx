/*
  File: components/DailyBriefing.tsx
  Purpose: Implements SECTION 1: THE "DAILY BRIEFING".
  This is a new component to greet the user and provide a personalized,
  high-level summary of their watchlist.
*/
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authcontext";
import { TrendingUp, TrendingDown, Sparkles, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function DailyBriefing() {
  const { user } = useAuth();

  const summary = {
    sentiment: "+0.34",
    sentimentLabel: "Strongly Positive",
    buySignals: 3,
    sellSignals: 1,
  };

  const happenings = [
    {
      id: 1,
      ticker: "AAPL",
      note: "Is trending on social media, with sentiment shifting negative.",
      icon: TrendingDown,
      color: "text-red-500",
    },
    {
      id: 2,
      ticker: "MSFT",
      note: "Has a new 'Golden Cross' technical signal detected by our AI.",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      id: 3,
      ticker: "Market",
      note: "The S&P 500 Sentiment just crossed into 'Negative' territory.",
      icon: TrendingDown,
      color: "text-red-500",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "Trader";

  return (
    <Card className="w-full border-2 border-border/50 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        {/* Personalized Greeting [cite: 203] */}
        <CardTitle className="font-serif-display text-4xl font-semibold text-gradient-hero">
          {getGreeting()}, {userName}.
        </CardTitle>
        <p className="text-lg text-muted-foreground">
          Here is your 1-minute briefing.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Watchlist AI Summary [cite: 204] */}
        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
            Watchlist AI Summary
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                Overall sentiment is{" "}
                <strong className="text-green-500">
                  {summary.sentimentLabel} ({summary.sentiment})
                </strong>
                .
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">
                You have{" "}
                <strong className="text-green-500">
                  {summary.buySignals} new AI positive signals
                </strong>{" "}
                and{" "}
                <strong className="text-red-500">
                  {summary.sellSignals} new negative signal
                </strong>{" "}
                to review.
              </span>
            </div>
          </div>
        </div>

        {/* What's Happening Module [cite: 206] */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
            What's Happening
          </h3>
          <div className="flex flex-col gap-3">
            {happenings.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5 flex-shrink-0", item.color)} />
                <p className="text-base text-foreground">
                  <span className="font-semibold">[{item.ticker}]</span>{" "}
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}