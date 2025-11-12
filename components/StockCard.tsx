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

interface StockCardProps {
  ticker: string;
  name: string;
  price: number;
  sentiment: number;
  sparkline: number[];
}

export default function StockCard({
  ticker,
  name,
  price,
  sentiment,
  sparkline,
}: StockCardProps) {
  const sentimentColor =
    sentiment > 0
      ? "text-green-500"
      : sentiment < 0
      ? "text-red-500"
      : "text-gray-500"; // Handle neutral sentiment
  const sparklineColor =
    sentiment > 0 ? "#22c55e" : sentiment < 0 ? "#ef4444" : "#6b7280"; // Handle neutral

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
    // Added hover effect to match new design
    <Card className="transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10">
      <Link href={`/stock/${ticker}`}>
        <CardHeader>
          <CardTitle>{ticker}</CardTitle>
          <CardDescription>{name}</CardDescription>
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
            ${price.toFixed(2)}
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