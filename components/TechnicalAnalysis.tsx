/*
  File: components/TechnicalAnalysis.tsx
  Purpose: Remove "Buy/Sell" text and icon from the main box, 
  as this logic is now in the "Oculus Prism" as the "Momentum" score.
*/
import * as React from "react"; 
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Signal, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

type TechnicalSignal = "Buy" | "Hold" | "Sell" | "N/A";

interface TechnicalAnalysisProps {
  indicators: Record<string, { value: string | number; signal: TechnicalSignal }>;
}

const signalClasses: Record<TechnicalSignal, string> = {
  Buy: "text-green-500 border-green-500/30 bg-green-500/10",
  Hold: "text-gray-500 border-gray-500/30 bg-gray-500/10",
  Sell: "text-red-500 border-red-500/30 bg-red-500/10",
  "N/A": "text-muted-foreground border-border/50 bg-background/50",
};

const indicatorIcon = (signal: TechnicalSignal) => {
  if (signal === "Buy") return ArrowUp;
  if (signal === "Sell") return ArrowDown;
  return Signal;
};

export function TechnicalAnalysis({ indicators }: TechnicalAnalysisProps) {
  const indicatorValues = Object.values(indicators || {});

  return (
    <Card className="border-2 border-border/50">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-primary" />
          <CardTitle>Technical Indicators</CardTitle>
        </div>
        <CardDescription className="text-sm font-medium text-destructive">
          <strong>IMPORTANT:</strong> This is automated technical data
          and NOT investment advice.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* --- MODIFICATION --- */}
        {/* The overall signal box is now neutral, as the Prism shows the score. */}
        <motion.div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-4 p-6 transition-all",
            "border-border/50 bg-background/50" // Neutral styling
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <BarChart3 className="h-16 w-16 text-muted-foreground" />
          <p className="text-sm mt-4 text-muted-foreground">
            Based on {indicatorValues.length} Key Indicators
          </p>
        </motion.div>
        {/* --- END MODIFICATION --- */}

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
          {Object.entries(indicators || {}).map(([key, { value, signal }]) => (
            <div key={key} className="flex flex-col">
              <span className="text-sm text-muted-foreground">{key}</span>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>{value}</span>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full p-1 text-xs font-medium",
                    signalClasses[signal]
                  )}
                >
                  {React.createElement(indicatorIcon(signal), {
                    className: "h-5 w-5",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <CardDescription className="mt-6 text-xs italic">
          Technical analysis is based on standard 14-day and 50/200-day moving
          averages. This is a premium feature.
        </CardDescription>
      </CardContent>
    </Card>
  );
}