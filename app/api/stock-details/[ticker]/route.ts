// app/api/stock-details/[ticker]/route.ts

// --- FIX: Import 'NextRequest' instead of just 'NextResponse' ---
import { NextResponse, NextRequest } from 'next/server';
// --- END FIX ---

import YahooFinance from 'yahoo-finance2';
import { db } from '@/firebase/admin';

const yahooFinance = new YahooFinance();

// Helper function to convert a raw score to a label
function getSentimentLabel(score: number): string {
  if (score > 0.5) return 'Strongly Positive';
  if (score > 0.1) return 'Positive';
  if (score < -0.5) return 'Strongly Negative';
  if (score < -0.1) return 'Negative';
  return 'Neutral';
}

type RatioRating = 'Strong' | 'Neutral' | 'Weak';
type TechnicalSignal = 'Buy' | 'Hold' | 'Sell' | 'N/A';

type NewsItem = {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
};

type AiInsight = {
  id: number;
  insight: string;
  type: string;
};

type StockDetailData = {
  ticker: string;
  name: string;
  price: number;
  previousClose: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  aiSummary: string;
  priceHistory: { name: string; price: number }[];
  sentiment: {
    score: number;
    label: string;
    history: { name: string; score: number }[];
  };
  recentNews: NewsItem[];
  keyStats: Record<string, string>;
  aiInsights: AiInsight[];
  financialRatios: Record<
    string,
    { value: string | number; rating: RatioRating }
  >;
  technicalIndicators: Record<
    string,
    { value: number | string; signal: TechnicalSignal }
  >;
};

export async function GET(
  // --- FIX: Change 'Request' to 'NextRequest' ---
  request: NextRequest,
  // --- END FIX ---
  context: { params: Promise<{ ticker: string }> }
) {
  try {
    // This is correct: context.params is a plain object
    const { ticker: rawTicker } = await context.params;

    if (!rawTicker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    const ticker = rawTicker.toUpperCase();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [quote, chartResult, searchResult, sentimentSnap] = await Promise.all([
      yahooFinance.quote(ticker),
      yahooFinance.chart(ticker, {
        period1: sixMonthsAgo,
        period2: new Date(),
        interval: '1d',
      }),
      yahooFinance.search(ticker, { newsCount: 5 }),
      db.collection('sentiment').doc(ticker).get(),
    ]);

    if (!quote || !quote.regularMarketPrice) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }

    const historicalQuotes = chartResult?.quotes || [];
    const recentNewsRaw = searchResult?.news || [];

    const changePct = quote.regularMarketChangePercent ?? 0;
    const changeVal = quote.regularMarketChange ?? 0;
    const changeType =
      changeVal > 0 ? 'positive' : changeVal < 0 ? 'negative' : 'neutral';

    const priceHistory: { name: string; price: number }[] =
      // --- FIX (from previous turn): Allow for 'null' values ---
      historicalQuotes.map((q: { date: string | Date; close?: number | null; adjclose?: number | null }) => ({
        name: new Date(q.date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        // The '??' operator correctly handles both null and undefined
        price: q.close ?? q.adjclose ?? 0,
      }));
    // --- END FIX ---

    const recentNews: NewsItem[] = recentNewsRaw.map(
      (item: {
        uuid: string;
        title: string;
        publisher: string;
        providerPublishTime: string | number | Date;
      }) => ({
        id: item.uuid,
        headline: item.title,
        source: item.publisher,
        timestamp: new Date(item.providerPublishTime).toLocaleString(),
        sentiment: ['positive', 'negative', 'neutral'][
          Math.floor(Math.random() * 3)
        ] as 'positive' | 'negative' | 'neutral',
      })
    );

    const keyStats = {
      'Prev. Close': quote.regularMarketPreviousClose?.toFixed(2) ?? 'N/A',
      'Market Cap':
        quote.marketCap?.toLocaleString('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }) ?? 'N/A',
      'Enterprise Value':
        quote.enterpriseValue?.toLocaleString('en-US', {
          notation: 'compact',
          compactDisplay: 'short',
        }) ?? 'N/A',
      'Beta (5Y)': quote.beta?.toFixed(2) ?? 'N/A',
      '52 Week High': quote.fiftyTwoWeekHigh?.toFixed(2) ?? 'N/A',
      '52 Week Low': quote.fiftyTwoWeekLow?.toFixed(2) ?? 'N/A',
      'P/E Ratio (TTM)': quote.trailingPE?.toFixed(2) ?? 'N/A',
      'P/S Ratio': quote.priceToSales?.toFixed(2) ?? 'N/A',
      'Avg. Volume': quote.averageDailyVolume3Month?.toLocaleString() ?? 'N/A',
    };

    const financialRatios: StockDetailData['financialRatios'] = {
      'P/E Ratio': {
        value: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
        rating:
          quote.trailingPE && quote.trailingPE < 25
            ? 'Strong'
            : quote.trailingPE && quote.trailingPE > 45
            ? 'Weak'
            : 'Neutral',
      },
      'Debt/Equity': { value: 0.52, rating: 'Strong' },
      'Current Ratio': { value: 1.89, rating: 'Strong' },
      ROE: { value: '15.4%', rating: 'Neutral' },
      'Gross Margin': { value: '42.1%', rating: 'Strong' },
      EBITDA: {
        value: quote.ebitda
          ? quote.ebitda.toLocaleString('en-US', {
              notation: 'compact',
              compactDisplay: 'short',
            })
          : 'N/A',
        rating: 'Strong',
      },
    };
    
    const technicalIndicators: StockDetailData['technicalIndicators'] = {
      'RSI (14)': { value: 68.5, signal: 'Hold' },
      MACD: { value: 1.25, signal: 'Buy' },
      'SMA (50)': {
        value: quote.fiftyDayAverage?.toFixed(2) ?? 'N/A',
        signal: 'Buy',
      },
      'SMA (200)': {
        value: quote.twoHundredDayAverage?.toFixed(2) ?? 'N/A',
        signal: 'Buy',
      },
      Stochastics: { value: 85.1, signal: 'Sell' },
    };

    const aiSummary = `${
      quote.longName || ticker
    } is currently showing a strong positive sentiment trend driven by recent product announcements and better-than-expected earnings projections. The AI detects a low correlation between current price and overall social media volume, suggesting the positive shift is news-driven rather than speculative chatter.`;

    const aiInsights: AiInsight[] = [
      {
        id: 1,
        insight:
          'Technical analysis indicates the 50-day moving average is crossing the 200-day, a classic "Golden Cross" buy signal.',
        type: 'technical',
      },
      {
        id: 2,
        insight:
          'Social media volume is 30% below the 30-day average, suggesting a low-risk entry point relative to media hype.',
        type: 'social',
      },
      {
        id: 3,
        insight:
          'Analyst ratings have been upgraded 4 times in the last 60 days, showing strong institutional confidence.',
        type: 'correlation',
      },
    ];

    let sentimentScore = 0;
    let sentimentLabel = 'Neutral';

    if (sentimentSnap.exists) {
      const sentimentData = sentimentSnap.data();
      if (sentimentData) {
        sentimentScore = sentimentData.score ?? 0;
        sentimentLabel = getSentimentLabel(sentimentScore);
      }
    }

    const data: StockDetailData = {
      ticker: ticker,
      name: quote.longName || quote.shortName || ticker,
      price: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      change: `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(
        2
      )} (${changePct.toFixed(2)}%)`,
      changeType: changeType,
      priceHistory: priceHistory,
      keyStats: keyStats,
      recentNews: recentNews,
      financialRatios: financialRatios,
      technicalIndicators: technicalIndicators,
      aiSummary: aiSummary,
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel,
        history: priceHistory.map((p) => ({
          name: p.name,
          score: Math.random() * 0.5 + 0.3,
        })),
      },
      aiInsights: aiInsights,
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('API Error:', errorMessage, errorStack);

    if (errorMessage.includes('404')) {
      const rawTicker = (await context.params as { ticker: string }).ticker;
      return NextResponse.json(
        { error: `Stock data not found for ${rawTicker}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch stock data from Yahoo Finance' },
      { status: 500 }
    );
  }
}