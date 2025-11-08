"use client";
import { useAuth } from "../context/authcontext";
import { Button } from "@/components/ui/button"; // Import Button
// You will need to create this component
// import StockCard from '../components/StockCard';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock watchlist data. You will fetch this from Firestore.
  // const watchlist = ['AAPL', 'GOOGL', 'TSLA'];
  const watchlist: string[] = []; // Set to empty to show the "Empty State"

  if (!user) {
    // For now, we'll show it for demo purposes
  }

  return (
    <div className="min-h-screen bg-white p-8 dark:bg-black">
      {/* We will add the persistent Navbar here later */}
      <header className="mb-8">
        <h1 className="text-4xl font-semibold text-black dark:text-zinc-50">
          Your Watchlist
        </h1>
      </header>

      {watchlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((ticker) => (
            <div
              key={ticker}
              className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                {ticker}
              </h2>
              {/* This is where <StockCard ticker={ticker} /> will go */}
              <p className="text-zinc-600 dark:text-zinc-400">Loading data...</p>
            </div>
          ))}
        </div>
      ) : (
        // Empty State UI
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 p-12 dark:border-zinc-800">
          <h2 className="text-2xl font-medium text-black dark:text-zinc-50">
            Your watchlist is empty.
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Add stocks to your watchlist to start tracking them.
          </p>
          <Button className="mt-6">
            Add a Stock
            {/* This will open a shadcn/ui Dialog modal later */}
          </Button>
        </div>
      )}
    </div>
  );
}