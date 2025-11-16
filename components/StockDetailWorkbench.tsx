// components/StockDetailWorkbench.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { PremiumGate } from "./PremiumGate";
import { FinancialScorecard } from "./FinancialScorecard";
import { TechnicalAnalysis } from "./TechnicalAnalysis";
import { AdvancedPriceChart } from "./AdvancedPriceChart";
import { BrainCircuit, Newspaper, MessageSquare } from 'lucide-react';
import { FinancialStatementsTable } from "./FinancialStatementsTable";
import { NewsFeed } from "./NewsFeed";
import { StockDetailData, EventMarker, AiPattern } from "@/app/stock/[ticker]/page"; // Import types
import { Skeleton } from "./ui/skeleton"; // Import Skeleton

interface StockDetailWorkbenchProps {
  data: StockDetailData | null; // Accept null data
  isPremium: boolean;
  defaultTab: "chart" | "insights" | "financials" | "news" | "profile";
  
  // Kinetix: Props for "Living Chart"
  newsEvents: EventMarker[];
  aiPatterns: AiPattern[];
}

export function StockDetailWorkbench({
  data,
  isPremium,
  defaultTab,
  newsEvents,
  aiPatterns,
}: StockDetailWorkbenchProps) {
  
  // Kinetix: Component-level loading state
  const isLoading = !data;

  // Destructure data with fallbacks
  const {
    ticker,
    priceHistory,
    sentiment,
    technicalIndicators,
    aiSummary,
    aiInsights,
    financialRatios,
    financialStatements,
    companyProfile,
  } = data || {};

  // --- Kinetix: "Calm Loading" Skeleton ---
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-full rounded-md" />
        <Card className="mt-4">
          <CardContent className="p-6">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    );
  }
  // --- End Skeleton ---

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="chart">Chart</TabsTrigger>
        <TabsTrigger value="insights">AI Insights</TabsTrigger>
        <TabsTrigger value="financials">Financials</TabsTrigger>
        <TabsTrigger value="news">News & Filings</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      {/* Tab 1: Chart */}
      <TabsContent value="chart" className="mt-4">
        <Card>
          <CardContent className="p-6">
            <div className="h-[500px] w-full">
              <AdvancedPriceChart
                priceHistory={priceHistory || []}
                sentimentHistory={sentiment?.history || []}
                technicalIndicators={technicalIndicators || {}}
                // Kinetix: Pass "Living Chart" props
                newsEvents={newsEvents}
                aiPatterns={aiPatterns}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 2: AI Insights */}
      <TabsContent value="insights" className="mt-4 space-y-6">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" /> AI Summary</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">
                  {aiSummary || 'No analysis available.'}
              </p>
          </CardContent>
        </Card>
        
        {/* Kinetix: "Natural Language Insight Stream" */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Natural Language Stream</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {(aiInsights && aiInsights.length > 0) ? (
                aiInsights.map((item) => (
                  <div key={item.id} className="text-sm">
                    <p className="leading-relaxed text-foreground">
                      {item.naturalLanguage || item.insight}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {item.timestamp || ""}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No AI insights to display.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Tab 3: Financials */}
      <TabsContent value="financials" className="mt-4">
        <PremiumGate featureName="Financials & Technicals">
          <div className="space-y-6">
            <FinancialScorecard ratios={financialRatios} />
            <TechnicalAnalysis indicators={technicalIndicators} />
            <FinancialStatementsTable financials={financialStatements} />
          </div>
        </PremiumGate>
      </TabsContent>

      {/* Tab 4: News & Filings */}
      <TabsContent value="news" className="mt-4">
        <NewsFeed ticker={ticker || ""} />
      </TabsContent>

      {/* Tab 5: Company Profile */}
      <TabsContent value="profile" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground">
              {companyProfile?.description || "Company profile data not yet available."}
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}