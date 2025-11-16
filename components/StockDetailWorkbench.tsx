// components/StockDetailWorkbench.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { PremiumGate } from "./PremiumGate";
import { FinancialScorecard } from "./FinancialScorecard";
import { TechnicalAnalysis } from "./TechnicalAnalysis";
import { Button } from "./ui/button";
import { useState } from "react";
import { AdvancedPriceChart } from "./AdvancedPriceChart";
import { BrainCircuit, Newspaper } from 'lucide-react';
import { FinancialStatementsTable } from "./FinancialStatementsTable";
import { NewsFeed } from "./NewsFeed"; // Import the new component

interface StockDetailWorkbenchProps {
  ticker: string; // Ticker is needed for the NewsFeed
  priceHistory: any[];
  sentimentHistory: any[];
  technicalIndicators: any;
  aiSummary: string;
  aiInsights: any[];
  recentNews: any[]; // This prop is no longer used, but keeping it doesn't hurt
  financialRatios: any;
  financialStatements: any;
  companyProfile: any;
  isPremium: boolean;
}

export function StockDetailWorkbench({
  ticker,
  priceHistory,
  sentimentHistory,
  technicalIndicators,
  aiSummary,
  aiInsights,
  recentNews, // No longer used, but fine to leave
  financialRatios,
  financialStatements,
  companyProfile,
  isPremium,
}: StockDetailWorkbenchProps) {
  
  return (
    <Tabs defaultValue="chart" className="w-full">
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
                priceHistory={priceHistory}
                sentimentHistory={sentimentHistory}
                technicalIndicators={technicalIndicators}
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
        
        {/* TODO: Add AI Insights and Sentiment-Driving News cards here */}
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
        {/* This is the new component */}
        <NewsFeed ticker={ticker} />
      </TabsContent>

      {/* Tab 5: Company Profile */}
      <TabsContent value="profile" className="mt-4">
        <Card>
          <CardHeader><CardTitle>Company Profile</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-muted-foreground">
              {companyProfile?.description || "Company profile data not yet available."}
            </p>
            {/* TODO: Add other profile info (execs, industry, etc.) */}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}