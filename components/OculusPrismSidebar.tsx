// components/OculusPrismSidebar.tsx
"use client";
// This component will use the existing Card component
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";
// We will need a RadarChart component, likely from recharts
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

// (Type definitions copied from page.tsx for stubbing)
type RatioRating = 'Strong' | 'Neutral' | 'Weak';
type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';
type StockDetailData = { /* ... (abbreviated) ... */ };

interface OculusPrismSidebarProps {
  sentiment: any;
  financialRatios: Record<string, { value: string | number, rating: RatioRating }>;
  technicalIndicators: Record<string, { value: number | string, signal: TechnicalSignal }>;
  keyStats: Record<string, string>;
  analystRatings: any; // Needs API
}

// Helper to derive scores (0-100) for the Prism.
// This is a placeholder and should be refined.
function derivePrismData(sentiment: any, financials: any, technicals: any) {
  const sentimentScore = Math.round((sentiment.score + 1) * 50); // Convert -1..1 to 0..100
  
  // TODO: Implement real logic
  const valuationScore = 65; // Placeholder
  const momentumScore = 80; // Placeholder
  const growthScore = 40; // Placeholder
  const hypeScore = 55; // Placeholder (Needs social volume data)

  return [
    { subject: 'Sentiment', score: sentimentScore, fullMark: 100 },
    { subject: 'Valuation', score: valuationScore, fullMark: 100 },
    { subject: 'Momentum', score: momentumScore, fullMark: 100 },
    { subject: 'Growth', score: growthScore, fullMark: 100 },
    { subject: 'Hype', score: hypeScore, fullMark: 100 },
  ];
}

export function OculusPrismSidebar({
  sentiment,
  financialRatios,
  technicalIndicators,
  keyStats,
  analystRatings,
}: OculusPrismSidebarProps) {

  const prismData = derivePrismData(sentiment, financialRatios, technicalIndicators);

  const sentimentColor =
    sentiment.score > 0.1
      ? "text-green-500"
      : sentiment.score < -0.1
      ? "text-red-500"
      : "text-gray-500";
  const sentimentBorderColor =
    sentiment.score > 0.1
      ? "border-green-500/30"
      : sentiment.score < -0.1
      ? "border-red-500/30"
      : "border-border/50";

  return (
    <>
      {/* Zone 2.1: The Oculus Prism Card */}
      <Card>
        <CardHeader>
          <CardTitle>Oculus Prism</CardTitle>
          <CardDescription>A 360° view of the stock's key factors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prismData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Zone 2.2: Enhanced AI Sentiment Card */}
      <Card className={cn("border-2", sentimentBorderColor)}>
        <CardHeader>
          <CardTitle>AI Sentiment Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn("text-7xl font-bold tracking-tight", sentimentColor)}>
            {sentiment.score > 0 ? "+" : ""}
            {sentiment.score?.toFixed(2) ?? 'N/A'}
          </p>
          <p className="text-2xl font-medium text-muted-foreground">
            {sentiment.label ?? 'No Data'}
          </p>
          {/* TODO: Add interactive sentiment history chart here */}
        </CardContent>
      </Card>

      {/* Zone 2.3: Analyst Ratings (New) */}
      <Card>
        <CardHeader>
          <CardTitle>Analyst Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {analystRatings ? (
            <>
              <p className="text-4xl font-bold text-primary">{analystRatings.recommendation}</p>
              <p className="text-muted-foreground">
                Avg. Target: {typeof analystRatings.targetPrice === 'number'
                  ? `$${analystRatings.targetPrice.toFixed(2)}`
                  : analystRatings.targetPrice}
              </p>
              {/* TODO: Add distribution bar chart here */}
            </>
          ) : (
            <p className="text-muted-foreground">No analyst data available.</p>
          )}
        </CardContent>
      </Card>

      {/* Zone 2.4: Enhanced Key Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement grouping and sector-average sparklines */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {Object.entries(keyStats || {}).length > 0 ? (
              Object.entries(keyStats || {}).map(([key, value]) => (
                <div key={key} className="flex flex-col">
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
    </>
  );
}