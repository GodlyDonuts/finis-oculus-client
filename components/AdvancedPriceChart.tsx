// components/AdvancedPriceChart.tsx
"use client";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Legend,
  CartesianGrid,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "./ui/button";

// (CustomTooltip stub copied from page.tsx)
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-background/90 p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.stroke }}>
            {`${p.name}: ${p.value?.toFixed(2)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Component Props ---
interface ChartDataPoint {
  name: string;
  price: number;
  volume?: number;
}

interface SentimentDataPoint {
  name: string;
  score: number;
}

interface AdvancedPriceChartProps {
  priceHistory: ChartDataPoint[];
  sentimentHistory: SentimentDataPoint[];
  technicalIndicators: Record<string, { value: number | string, signal: string }>;
}

export function AdvancedPriceChart({
  priceHistory,
  sentimentHistory,
  technicalIndicators,
}: AdvancedPriceChartProps) {
  const [chartType, setChartType] = useState<"area" | "line" | "candlestick">("area");
  const [overlays, setOverlays] = useState<string[]>([]);

  // Memoize combined data to prevent re-computation
  const combinedData = useMemo(() => {
    const sentimentMap = new Map(sentimentHistory.map(item => [item.name, item.score]));
    const sma50 = technicalIndicators["SMA (50)"]?.value;
    const sma200 = technicalIndicators["SMA (200)"]?.value;

    return priceHistory.map(item => ({
      ...item,
      sentiment: sentimentMap.get(item.name) || null,
      sma50: sma50 ? Number(sma50) : null, // This is a single value, not historical.
      sma200: sma200 ? Number(sma200) : null, // TODO: API should provide historical SMAs
    }));
  }, [priceHistory, sentimentHistory, technicalIndicators]);

  // TODO: Candlestick (OHLC) data is not yet provided by the API.
  // We will disable this option for now.

  const yAxisDomain = [
    (dataMin: number) => (dataMin * 0.95).toFixed(2),
    (dataMax: number) => (dataMax * 1.05).toFixed(2),
  ];

  return (
    <div className="flex h-full w-full flex-col">
      {/* Chart Controls */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ToggleGroup type="single" value={chartType} onValueChange={(val: "area" | "line" | "candlestick") => val && setChartType(val)}>
          <ToggleGroupItem value="area">Area</ToggleGroupItem>
          <ToggleGroupItem value="line">Line</ToggleGroupItem>
          <ToggleGroupItem value="candlestick" disabled>Candlestick</ToggleGroupItem>
        </ToggleGroup>
        
        <ToggleGroup type="multiple" value={overlays} onValueChange={setOverlays}>
          <ToggleGroupItem value="sentiment">Sentiment</ToggleGroupItem>
          <ToggleGroupItem value="sma50" disabled>SMA 50</ToggleGroupItem>
          <ToggleGroupItem value="sma200" disabled>SMA 200</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Main Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="left"
              dataKey="price"
              fontSize={12}
              tickFormatter={(val) => `$${val}`}
              domain={yAxisDomain}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <YAxis
              yAxisId="right"
              dataKey="sentiment"
              orientation="right"
              domain={[-1, 1]}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Main Price Chart Type */}
            {chartType === 'area' && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="hsl(var(--primary))"
                fill="url(#priceGradient)"
                strokeWidth={2}
              />
            )}
            {chartType === 'line' && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="price"
                name="Price"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            )}

            {/* Overlays */}
            {overlays.includes("sentiment") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sentiment"
                name="Sentiment"
                stroke="#f59e0b" // Amber color
                strokeWidth={2}
                dot={false}
              />
            )}

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Volume Chart */}
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={combinedData}>
            <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} tick={false} />
            <YAxis
              dataKey="volume"
              axisLine={false}
              tickLine={false}
              fontSize={10}
              tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="volume"
              name="Volume"
              fill="hsl(var(--primary) / 0.2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}