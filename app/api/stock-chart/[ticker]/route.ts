// app/api/stock-chart/[ticker]/route.ts
// FIX 1: Import 'NextRequest' instead of just using the global 'Request'
import { NextResponse, NextRequest } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

// --- Type definitions (unchanged) ---
type YahooInterval = "1m" | "2m" | "5m" | "15m" | "30m" | "60m" | "90m" | "1h" | "1d" | "5d" | "1wk" | "1mo" | "3mo";

type YahooQuote = {
  date: string | Date;
  close?: number | null;
  adjclose?: number | null;
};

type PriceHistoryPoint = {
  name: string;
  price: number | null | undefined;
};

type FinalPricePoint = {
  name: string;
  price: number;
}
// --- Helper functions (unchanged) ---
function getChartOptions(range: string) {
  const options: { period1: Date; interval: YahooInterval } = {
    period1: new Date(),
    interval: '1d',
  };
  const now = new Date();
  switch (range) {
    case '1D':
      options.period1.setDate(now.getDate() - 1);
      options.interval = '15m';
      break;
    case '1W':
      options.period1.setDate(now.getDate() - 7);
      options.interval = '1h';
      break;
    case '1M':
    case '6M':
    case 'YTD':
    case '1Y':
      options.period1.setMonth(now.getMonth() - 1);
      options.interval = '1d';
      if (range === '6M') options.period1.setMonth(now.getMonth() - 6);
      if (range === '1Y') options.period1.setFullYear(now.getFullYear() - 1);
      break;
    case '5Y':
      options.period1.setFullYear(now.getFullYear() - 5);
      options.interval = '1wk';
      break;
    case 'Max':
      options.period1 = new Date('1970-01-01');
      options.interval = '1mo';
      break;
    default:
      options.period1.setMonth(now.getMonth() - 6);
      options.interval = '1d';
  }
  return options;
}

function formatLabel(date: Date, range: string, timezone: string) {
  const options: Intl.DateTimeFormatOptions = { timeZone: timezone };
  switch (range) {
    case '1D':
    case '1W':
      options.hour = 'numeric';
      options.minute = '2-digit';
      return date.toLocaleTimeString('en-US', options);
    case '1M':
    case '6M':
    case 'YTD':
    case '1Y':
      options.month = 'short';
      options.day = 'numeric';
      return date.toLocaleDateString('en-US', options);
    case '5Y':
    case 'Max':
      options.month = 'short';
      options.day = 'numeric';
      options.year = 'numeric';
      return date.toLocaleDateString('en-US', options);
    default:
      options.month = 'short';
      options.day = 'numeric';
      return date.toLocaleDateString('en-US', options);
  }
}
// --- (End helper functions) ---

export async function GET(
  // FIX 2: Change 'Request' to 'NextRequest'
  request: NextRequest,
  // FIX 3: Change context.params back to a Promise, as required by your error
  context: { params: Promise<{ ticker: string }> }
) {
  
  // FIX 4: 'await' the params, as it is now a Promise
  const { ticker } = await context.params;

  try {
    // Use 'request.nextUrl' (from NextRequest) instead of 'new URL(request.url)'
    const { searchParams } = request.nextUrl;
    const range = searchParams.get('range') || '6M';

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    const { period1, interval } = getChartOptions(range);

    const chartResult = await yahooFinance.chart(ticker, {
      period1: period1,
      period2: new Date(),
      interval: interval,
    });

    if (!chartResult || !chartResult.meta || chartResult.meta.regularMarketPrice == null) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }

    const historicalQuotes = chartResult.quotes || [];
    const timezone = chartResult.meta?.exchangeTimezoneName || 'America/New_York';

    const priceHistory = historicalQuotes
      .map((q: YahooQuote) => {
        const quoteDate = new Date(q.date);
        return {
          name: formatLabel(quoteDate, range, timezone),
          price: q.close ?? q.adjclose, 
        };
      })
      .filter(
        (p: PriceHistoryPoint): p is FinalPricePoint => 
          p.price != null && p.price > 0
      );
    
    // These coercions remain correct
    const changeVal = Number(chartResult.meta.regularMarketChange) || 0;
    const changePct = Number(chartResult.meta.regularMarketChangePercent) || 0;
    
    const changeType =
      Number(changeVal) > 0 ? 'positive' : Number(changeVal) < 0 ? 'negative' : 'neutral';

    return NextResponse.json({
      priceHistory, 
      price: chartResult.meta.regularMarketPrice,
      change: `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(
        2
      )} (${changePct.toFixed(2)}%)`, 
      changeType: changeType,
    });

  } catch (error: unknown) { 
    
    let errorMessage = 'Failed to fetch stock chart data';
    let errorStatus = 500;
    let logMessage = 'An unknown error occurred:';

    if (error instanceof Error) {
      logMessage = 'Yahoo Finance Chart API Error:';
      console.error(logMessage, error.message);
      
      if (error.message.includes('404')) {
        errorMessage = `Chart data not found for ${ticker || 'unknown ticker'}`;
        errorStatus = 404;
      }
    } else {
      console.error(logMessage, error);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: errorStatus }
    );
  }
}