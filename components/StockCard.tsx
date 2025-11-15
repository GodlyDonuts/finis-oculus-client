// components/StockCard.tsx
"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StockCardProps {
  ticker: string;
  name: string;
  price: number | null; // Updated to allow null
  sentiment: number;
  sparkline: number[];
  aiSignal: "BUY" | "SELL" | "HOLD";
}

// Visual-only classes for the AI Signal dot
const signalDotClasses = {
  BUY: "bg-green-500 border-green-400",
  SELL: "bg-red-500 border-red-400",
  HOLD: "bg-gray-500 border-gray-400",
};

// Accessibility titles for the dot (non-advisory)
const signalTitle = {
  BUY: "AI Signal: Positive",
  SELL: "AI Signal: Negative",
  HOLD: "AI Signal: Neutral",
};

export default function StockCard({
  ticker,
  name,
  price,
  sentiment,
  sparkline,
  aiSignal,
}: StockCardProps) {
  const sentimentColor =
    sentiment > 0.1
      ? "text-green-500"
      : sentiment < -0.1
      ? "text-red-500"
      : "text-gray-500";
  const sparklineColor =
    sentiment > 0.1 ? "#22c55e" : sentiment < -0.1 ? "#ef4444" : "#6b7280";

  // Sentiment Glow Class
  const sentimentGlowClass =
    sentiment > 0.1
      ? "hover:border-green-500/50 hover:shadow-green-500/10"
      : sentiment < -0.1
      ? "hover:border-red-500/50 hover:shadow-red-500/10"
      : "hover:border-primary/50 hover:shadow-primary/10";

  const chartData = sparkline.map((value, index) => ({
    name: index,
    value: value,
  }));

  // Animation props
  const motionProps = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Card
      className={cn(
        "transition-all hover:-translate-y-1 bg-card/70 backdrop-blur-sm border-2 border-border/50",
        sentimentGlowClass
      )}
    >
      <Link href={`/stock/${ticker}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>{ticker}</CardTitle>
              <CardDescription>{name}</CardDescription>
            </div>
            {/* Replaced Badge with visual-only dot */}
            <div
              title={signalTitle[aiSignal]}
              className={cn(
                "h-3 w-3 flex-shrink-0 rounded-full border",
                signalDotClasses[aiSignal]
              )}
            />
          </div>
        </CardHeader>
        <div className="h-20 w-full px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelFormatter={() => ""}
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Price",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <CardContent className="flex items-baseline justify-between pt-4">
          <motion.span
            className="text-3xl font-semibold"
            {...motionProps}
          >
            {/* Check if price is a valid number before formatting */}
            {typeof price === "number" ? `$${price.toFixed(2)}` : "N/A"}
          </motion.span>
          <motion.span
            className={`text-lg font-medium ${sentimentColor}`}
            {...motionProps}
          >
            {sentiment > 0 ? "+" : ""}
            {sentiment.toFixed(2)}
          </motion.span>
        </CardContent>
      </Link>
    </Card>
  );
}