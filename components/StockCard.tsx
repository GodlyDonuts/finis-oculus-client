"use client";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StockCardProps {
  ticker: string;
}

export default function StockCard({ ticker }: StockCardProps) {
  /*
    Per the README, you would fetch data here:
    const { data, error, isLoading } = useSWR(
      `/api/get_stock_details/${ticker}`, 
      fetcher
    );

    if (isLoading) return <StockCardSkeleton />;
  */

  // Mock data for now
  const data = {
    name:
      ticker === "AAPL"
        ? "Apple Inc."
        : ticker === "GOOGL"
        ? "Alphabet Inc."
        : "Tesla, Inc.",
    price: ticker === "AAPL" ? 189.99 : ticker === "GOOGL" ? 177.85 : 175.22,
    sentiment: ticker === "AAPL" ? 0.75 : ticker === "GOOGL" ? 0.5 : -0.2,
  };

  const sentimentColor =
    data.sentiment > 0 ? "text-green-500" : "text-red-500";

  return (
    <Card className="transition-all hover:shadow-md">
      <Link href={`/stock/${ticker}`}>
        <CardHeader>
          <CardTitle>{ticker}</CardTitle>
          <CardDescription>{data.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-baseline justify-between">
          <span className="text-3xl font-semibold">${data.price}</span>
          <span className={`text-lg font-medium ${sentimentColor}`}>
            {data.sentiment > 0 ? "+" : ""}
            {data.sentiment.toFixed(2)}
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}