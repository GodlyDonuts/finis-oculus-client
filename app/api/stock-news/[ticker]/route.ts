// app/api/stock-news/[ticker]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { XMLParser } from 'fast-xml-parser'; // NEW: Import XML parser

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
  // We no longer support pagination, so hasMore and nextPage are removed
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> } // Use Promise/await
) {
  try {
    const { ticker } = await context.params; // Use await
    const { searchParams } = request.nextUrl;
    const filter = searchParams.get('filter') || 'all'; // 'all', 'news', 'filings'

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
    }

    let newsItems: NewsItem[] = [];
    const parser = new XMLParser({
      ignoreAttributes: false, // We need 'href' attributes
      attributeNamePrefix: "@_"
    });

    if (filter === 'filings') {
      // 1. SEC FILINGS: Fetch from the SEC EDGAR RSS feed
      const url = `https://www.sec.gov/cgi-bin/browse-edgar?company=${ticker}&owner=exclude&action=getcompany&output=atom`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Finis Oculus me@example.com' } // SEC requires a User-Agent
      });
      if (!response.ok) throw new Error(`Failed to fetch SEC data: ${response.statusText}`);
      
      const xmlData = await response.text();
      const data = parser.parse(xmlData);
      
      const entries = data.feed?.entry || [];
      newsItems = entries.map((item: any) => ({
        id: item.id, // This is a unique string 'urn:uuid:...'
        headline: item.title,
        source: 'SEC EDGAR',
        timestamp: new Date(item.updated).toLocaleString(),
        link: item.link["@_href"], // This is correct
        sentiment: 'neutral',
      }));

    } else {
      // 2. ALL / NEWS: Fetch from Google News RSS
      const query = (filter === 'news') ? `${ticker} stock` : ticker;
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch Google News: ${response.statusText}`);
      
      const xmlData = await response.text();
      const data = parser.parse(xmlData);

      const entries = data.rss?.channel?.item || [];
      
      // --- THIS IS THE FIX ---
      newsItems = entries.slice(0, 30).map((item: any) => ({
        id: item.link, // Use the link as the ID. It's a unique string.
        headline: item.title, // This is already a string
        source: item.source['#text'] || item.source, // Pluck the text from the source object
        timestamp: new Date(item.pubDate).toLocaleString(),
        link: item.link, // This is already a string
        sentiment: ['positive', 'negative', 'neutral'][
          Math.floor(Math.random() * 3)
        ] as 'positive' | 'negative' | 'neutral',
      }));
      // --- END FIX ---
    }

    return NextResponse.json({ news: newsItems });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error (stock-news):', errorMessage, error.stack);
    return NextResponse.json(
      { error: `Failed to fetch stock news: ${errorMessage}` },
      { status: 500 }
    );
  }
}