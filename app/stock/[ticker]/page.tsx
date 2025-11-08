"use client";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// You would import your chart component from Recharts
// import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

// Mock data for the chart
const chartData = [
  { name: "Jan", price: 150 },
  { name: "Feb", price: 155 },
  { name: "Mar", price: 160 },
  { name: "Apr", price: 158 },
  { name: "May", price: 165 },
];

// Mock news data
const mockNews = [
  {
    id: 1,
    headline: "Mock Headline: {ticker} Announces New Product",
    source: "MarketWatch",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    headline: "Mock Headline: Analysts Upgrade {ticker} Stock",
    source: "Reuters",
    timestamp: "5 hours ago",
  },
];

export default function StockDetailPage() {
  const params = useParams();
  const ticker = params.ticker as string;

  // Mock sentiment data
  const sentiment = {
    score: 0.82,
    label: "Strongly Positive",
  };
  // const sentiment = { score: -0.25, label: "Slightly Negative" }; // For testing negative
  
  const sentimentColor =
    sentiment.score > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-white p-8 dark:bg-black">
      {/* We will add the persistent Navbar here later */}
      <header className="mb-8">
        <h1 className="text-5xl font-semibold text-black dark:text-zinc-50">
          {ticker.toUpperCase()}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 w-full">
                {/* <LineChart width={...} height={...} data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="price" stroke="#8884d8" />
                  </LineChart>
                */}
                <p className="flex h-full items-center justify-center text-zinc-500">
                  Recharts chart will go here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="flex flex-col gap-8 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>AI Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${sentimentColor}`}>
                {sentiment.score > 0 ? "+" : ""}
                {sentiment.score.toFixed(2)}
              </p>
              <p className="text-xl text-zinc-600 dark:text-zinc-400">
                {sentiment.label}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent News</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {mockNews.map((item) => (
                <div key={item.id} className="flex flex-col gap-1">
                  <p className="font-medium text-black dark:text-white">
                    {item.headline.replace("{ticker}", ticker.toUpperCase())}
                  </p>
                  <div className="flex gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span>{item.source}</span>
                    <span>&middot;</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}