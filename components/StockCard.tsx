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
import { motion } from "framer-motion"; // [cite: 174]

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
    sentiment > 0 ? "text-green-500" : "text-red-500";
  const sparklineColor = sentiment > 0 ? "#22c55e" : "#ef4444";

  const chartData = sparkline.map((value, index) => ({
    name: index,
    value: value,
  }));

  // Animation props [cite: 175]
  const motionProps = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Card className="transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/stock/${ticker}`}>
        <CardHeader>
          <CardTitle>{ticker}</CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <div className="h-20 w-full">
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
          {/* [cite: 175] */}
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