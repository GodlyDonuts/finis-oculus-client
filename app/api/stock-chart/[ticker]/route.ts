// app/api/stock-chart/[ticker]/route.ts

// app/api/stock-chart/[ticker]/route.ts
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2'; // Use the Class
const yahooFinance = new YahooFinance(); // Instantiate it

/**
 * Helper function to get the start date and interval for the chart
 * based on the requested range.
 * (This function is unchanged)
 */
function getChartOptions(range: string) {
  const options: { period1: Date | string; interval: string } = {
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
      options.period1 = '1970-01-01';
      options.interval = '1mo';
      break;
    default:
      options.period1.setMonth(now.getMonth() - 6);
      options.interval = '1d';
  }

  return options;
}

// --- THIS IS THE NEW, IMPROVED HELPER FUNCTION ---
/**
 * Helper function to format the date/time label for the x-axis
 * based on the selected range and the exchange's timezone.
 */
function formatLabel(date: Date, range: string, timezone: string) {
  const options: Intl.DateTimeFormatOptions = { timeZone: timezone };

  switch (range) {
    case '1D':
    case '1W':
      // For 1D and 1W, show time (e.g., "9:30 AM")
      options.hour = 'numeric';
      options.minute = '2-digit';
      return date.toLocaleTimeString('en-US', options);

    case '1M':
    case '6M':
    case 'YTD':
    case '1Y':
      // For mid-ranges, show Month/Day (e.g., "Nov 11")
      options.month = 'short';
      options.day = 'numeric';
      return date.toLocaleDateString('en-US', options);

    case '5Y':
    case 'Max':
      // For long ranges, show Month/Day/Year (e.g., "Nov 11, 2020")
      options.month = 'short';
      options.day = 'numeric';
      options.year = 'numeric';
      return date.toLocaleDateString('en-US', options);

    default:
      // Fallback (e.g., for default 6M)
      options.month = 'short';
      options.day = 'numeric';
      return date.toLocaleDateString('en-US', options);
  }
}
// --- END NEW HELPER FUNCTION ---

export async function GET(
  request: Request,
  context: { params: any }
) {
  try {
    // --- THIS IS THE FIX ---
    // The error is correct, context.params must be awaited
    const { ticker } = await context.params;
    // --- END FIX ---

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '6M';

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    const { period1, interval } = getChartOptions(range);

    // --- MANDATORY FIX: Fetch Quote and Chart in parallel (Fix 1.3) ---
    const [chartResult, quote] = await Promise.all([
      yahooFinance.chart(ticker, {
        period1: period1,
        period2: new Date(),
        interval: interval,
      }),
      yahooFinance.quote(ticker), // Fetch current market data
    ]);
    // --- END MANDATORY FIX ---

    if (!quote || !quote.regularMarketPrice) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }

    const historicalQuotes = chartResult.quotes || [];

    // 1. Get the exchange timezone from the chart metadata.
    //    Fall back to 'America/New_York' if not provided.
    const timezone = chartResult.meta?.exchangeTimezoneName || 'America/New_York';

    // 2. Map all quotes first.
    const priceHistory = historicalQuotes
      .map((q: any) => {
        const quoteDate = new Date(q.date);
        return {
          // 3. Use the new formatLabel function
          name: formatLabel(quoteDate, range, timezone),
          // Get the price, but don't default to 0
          price: q.close ?? q.adjclose,
        };
      })
      // 4. NOW, filter out any point where price is not a positive number.
      .filter((p: any) => p.price != null && p.price > 0);
    
    // --- MANDATORY FIX: Return quote data (Fix 1.3) ---
    const changeVal = quote.regularMarketChange ?? 0;
    const changePct = quote.regularMarketChangePercent ?? 0;
    const changeType =
      changeVal > 0 ? 'positive' : changeVal < 0 ? 'negative' : 'neutral';

    return NextResponse.json({
      priceHistory,
      // Current market data
      price: quote.regularMarketPrice,
      change: `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(
        2
      )} (${changePct.toFixed(2)}%)`,
      changeType: changeType,
    });
    // --- END MANDATORY FIX ---

  } catch (error: any) {
    console.error('Yahoo Finance Chart API Error:', error.message);
    if (error.message.includes('404')) {
      return NextResponse.json(
        { error: `Chart data not found for ${context.params.ticker}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch stock chart data' },
      { status: 500 }
    );
  }
}