// app/api/stock-news/[ticker]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Define the type for the news item
type NewsItem = {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  link: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

// Define the API response type
type ApiResponse = {
  news: NewsItem[];
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> } // Reverted to Promise as per last error
) {
  try {
    const { ticker } = await context.params; // Reverted to await

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    // --- THIS IS THE FIX ---
    // We removed all pagination and filter logic.
    // We just fetch the top 20 news items.
    const searchResult = await yahooFinance.search(ticker, {
      newsCount: 20, // Get a fixed amount
      // 'newsOffset' and 'newsType' are NOT valid options
    });
    // --- END FIX ---

    const newsItems: NewsItem[] = (searchResult?.news || []).map((item: any) => ({
      id: item.uuid,
      headline: item.title,
      source: item.publisher,
      timestamp: new Date(item.providerPublishTime).toLocaleString(),
      link: item.link,
      // Add mock sentiment
      sentiment: ['positive', 'negative', 'neutral'][
        Math.floor(Math.random() * 3)
      ] as 'positive' | 'negative' | 'neutral',
    }));

    return NextResponse.json({
      news: newsItems,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error (stock-news):', errorMessage, error.stack);
    
    return NextResponse.json(
      { error: `Failed to fetch stock news: ${errorMessage}` },
      { status: 500 }
    );
  }
}