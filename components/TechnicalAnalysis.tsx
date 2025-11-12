// components/TechnicalAnalysis.tsx

import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Signal, BarChart3, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';

interface TechnicalAnalysisProps {
  indicators: Record<string, { value: string | number, signal: TechnicalSignal }>;
}

const signalClasses: Record<TechnicalSignal, string> = {
    Buy: "text-green-500 border-green-500/30 bg-green-500/10",
    Hold: "text-gray-500 border-gray-500/30 bg-gray-500/10",
    Sell: "text-red-500 border-red-500/30 bg-red-500/10",
    "N/A": "text-muted-foreground border-border/50 bg-background/50",
};

const indicatorIcon = (signal: TechnicalSignal) => {
    if (signal === 'Buy') return <ArrowUp className="h-5 w-5" />;
    if (signal === 'Sell') return <ArrowDown className="h-5 w-5" />;
    return <Signal className="h-5 w-5" />;
};

export function TechnicalAnalysis({ indicators }: TechnicalAnalysisProps) {

    // Logic to determine an overall signal
    const indicatorValues = Object.values(indicators || {}); 
    const overallSignal = indicatorValues.reduce((acc, { signal }) => {
        if (signal === 'Buy') acc.buy++;
        else if (signal === 'Sell') acc.sell++;
        else acc.hold++;
        return acc;
    }, { buy: 0, sell: 0, hold: 0 });

    const finalSignal: TechnicalSignal = overallSignal.buy > overallSignal.sell ? 'Buy' : overallSignal.sell > overallSignal.buy ? 'Sell' : 'Hold';


    return (
        <Card className="border-2 border-border/50">
            <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <CardTitle>Technical Analysis Score</CardTitle>
                </div>
                <CardDescription className="text-sm font-medium text-destructive">
                    <strong>IMPORTANT:</strong> This is an automated technical indicator and NOT investment advice.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <motion.div
                    className={cn(
                        "flex flex-col items-center justify-center rounded-xl border-4 p-6 transition-all",
                        signalClasses[finalSignal]
                    )}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-sm text-muted-foreground">Overall Signal</p>
                    <p className="font-serif-display text-5xl font-extrabold tracking-tight">
                        {finalSignal.toUpperCase()}
                    </p>
                    <p className="text-sm mt-1 text-muted-foreground">Based on {indicatorValues.length} Key Indicators</p>
                </motion.div>

                <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
                    {Object.entries(indicators || {}).map(([key, { value, signal }]) => (
                        <div key={key} className="flex flex-col">
                            <span className="text-sm text-muted-foreground">{key}</span>
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>{value}</span>
                                <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", signalClasses[signal])}>
                                    {indicatorIcon(signal)}
                                    <span className="text-xs">{signal}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <CardDescription className="mt-6 text-xs italic">
                    Technical analysis is based on standard 14-day and 50/200-day moving averages. This is a premium feature.
                </CardDescription>
            </CardContent>
        </Card>
    );
}