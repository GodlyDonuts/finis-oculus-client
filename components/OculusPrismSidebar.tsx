// components/OculusPrismSidebar.tsx
"use client";
// import { useState } from "react"; // Kinetix: No longer needed
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { StockDetailData } from "@/app/stock/[ticker]/page"; // Import main type
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface OculusPrismSidebarProps {
  data: StockDetailData | null; // Accept null data
}

// Helper to derive scores (0-100) for the Prism.
function derivePrismData(sentiment: any, financials: any, technicals: any) {
  const sentimentScore = Math.round(((sentiment?.score ?? 0) + 1) * 50); // Convert -1..1 to 0..100
  
  // TODO: Implement real logic
  const valuationScore = 65; // Placeholder
  const momentumScore = 80; // Placeholder
  const growthScore = 40; // Placeholder
  const hypeScore = 55; // Placeholder
  
  return [
    { subject: 'Sentiment', score: sentimentScore, fullMark: 100 },
    { subject: 'Valuation', score: valuationScore, fullMark: 100 },
    { subject: 'Momentum', score: momentumScore, fullMark: 100 },
    { subject: 'Growth', score: growthScore, fullMark: 100 },
    { subject: 'Hype', score: hypeScore, fullMark: 100 },
  ];
}

export function OculusPrismSidebar({ data }: OculusPrismSidebarProps) {
  // Kinetix: Component-level loading state
  const isLoading = !data;

  // Destructure data with fallbacks
  const {
    sentiment,
    financialRatios,
    technicalIndicators,
    keyStats,
    analystRatings,
  } = data || {};

  // Kinetix: State for "Prism 2.0" card-flip has been REMOVED
  const prismData = derivePrismData(sentiment, financialRatios, technicalIndicators);

  const sentimentColor =
    sentiment && sentiment.score > 0.1
      ? "text-green-500"
      : sentiment && sentiment.score < -0.1
      ? "text-red-500"
      : "text-gray-500";
  const sentimentBorderColor =
    sentiment && sentiment.score > 0.1
      ? "border-green-500/30"
      : sentiment && sentiment.score < -0.1
      ? "border-red-500/30"
      : "border-border/50";

  // --- Kinetix: "Calm Loading" Skeletons ---
  if (isLoading) {
    return (
      <>
        {/* Prism Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-full" />
          </CardContent>
        </Card>
        {/* Sentiment Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-14 w-24 rounded-md" />
            <Skeleton className="mt-2 h-6 w-32 rounded-md" />
          </CardContent>
        </Card>
        {/* Key Stats Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </>
    );
  }
  // --- End Skeletons ---


  return (
    <>
      {/* Zone 2.1: The Oculus Prism Card (Kinetix 2.0) */}
      {/* Kinetix: REMOVED flip wrappers and onClick */}
      <Card>
        <CardHeader>
          <CardTitle>Oculus Prism</CardTitle>
          {/* Kinetix: UPDATED description */}
          <CardDescription>A 360° view of the stock's key factors.</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="h-64 w-full"
            // Kinetix: "Animated Spokes" (Hype Jitter)
            // This is a mock pulse. A real impl would tie this to data.
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={prismData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
      {/* Kinetix: REMOVED the "back of card" component */}


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
        </CardContent>
      </Card>

      {/* Zone 2.3: Analyst Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Analyst Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {analystRatings ? (
            <>
              <p className="text-4xl font-bold text-primary capitalize">{analystRatings.recommendation}</p>
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