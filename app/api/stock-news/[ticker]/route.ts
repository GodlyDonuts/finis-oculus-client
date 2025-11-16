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
  hasMore: boolean;
  nextPage: number;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await context.params;
    const { searchParams } = request.nextUrl;

    // Get query params for pagination and filtering
    const page = parseInt(searchParams.get('page') || '1', 10);
    const filter = searchParams.get('filter') || 'all'; // 'all', 'news', 'filings'
    const count = 10; // Number of items per page
    const offset = (page - 1) * count;

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    // Map our filter to the 'newsType' array for the API
    let newsType: string[] = ["STORY", "FILING", "VIDEO"]; // Default for 'all'
    if (filter === 'news') {
      newsType = ["STORY", "VIDEO"]; // 'STORY' seems to be the main one
    } else if (filter === 'filings') {
      newsType = ["FILING"]; // SEC Filings
    }

    // Fetch from yahoo-finance2
    const searchResult = await yahooFinance.search(ticker, {
      newsCount: count,
      newsOffset: offset,
      newsType: newsType,
    });

    const newsItems: NewsItem[] = (searchResult?.news || []).map((item: any) => ({
      id: item.uuid,
      headline: item.title,
      source: item.publisher,
      timestamp: new Date(item.providerPublishTime).toLocaleString(),
      link: item.link,
      // Add mock sentiment until a real sentiment model is on this endpoint
      sentiment: ['positive', 'negative', 'neutral'][
        Math.floor(Math.random() * 3)
      ] as 'positive' | 'negative' | 'neutral',
    }));

    // Determine if there are more pages
    const hasMore = newsItems.length === count;

    return NextResponse.json({
      news: newsItems,
      hasMore: hasMore,
      nextPage: hasMore ? page + 1 : page,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error (stock-news):', errorMessage);
    
    return NextResponse.json(
      { error: 'Failed to fetch stock news' },
      { status: 500 }
    );
  }
}