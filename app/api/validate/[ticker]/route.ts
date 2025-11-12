// app/api/validate/[ticker]/route.ts
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(request: Request, context: { params: any }) {
  try {
    // --- THIS IS THE FIX ---
    const { ticker } = await context.params;
    // --- END FIX ---

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    try {
      const quote: any = await yahooFinance.quote(ticker);
      if (quote && quote.regularMarketPrice) {
        return NextResponse.json(
          { message: `Ticker ${ticker} is valid.` },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { error: 'Ticker not found or invalid' },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error(`Validation failed for ${ticker}:`, error);
      return NextResponse.json(
        { error: 'Ticker not found or invalid' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in route params:', error);
    return NextResponse.json(
      { error: 'Failed to resolve route parameters' },
      { status: 500 }
    );
  }
}