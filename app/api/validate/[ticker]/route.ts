import { NextResponse } from 'next/server';

// 1. Change the signature to get the whole 'context' object
//    We give 'params' a type of 'any' or 'unknown' because it's a Promise,
//    which is not what the type { ticker: string } expects.
export async function GET(request: Request, context: { params: any }) {
  
  try {
    // 2. Await the 'params' object, as the error message demands
    const awaitedParams = await context.params;

    // 3. Now, destructure 'ticker' from the resolved object
    const { ticker } = awaitedParams;

    if (!ticker) {
      return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
    }

    if (ticker.length > 5 || !/^[A-Z]+$/.test(ticker)) {
      return NextResponse.json({ error: 'Invalid ticker format' }, { status: 400 });
    }

    return NextResponse.json({ message: `Ticker ${ticker} is valid.` }, { status: 200 });

  } catch (error) {
    console.error("Error awaiting params:", error);
    return NextResponse.json({ error: 'Failed to resolve route parameters' }, { status: 500 });
  }
}