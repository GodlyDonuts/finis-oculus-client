// app/api/stock-details/[ticker]/route.ts

import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
// --- UPDATED IMPORT ---
// Use the new admin config, NOT the client config
import { db } from '@/app/firebase/admin';
// --- END UPDATED IMPORT ---

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
  recentNews: any[];
  keyStats: Record<string, string>;
  aiInsights: any[];
  financialRatios: Record<string, { value: string | number, rating: RatioRating }>;
  technicalIndicators: Record<string, { value: number, signal: TechnicalSignal }>;
};

export async function GET(
  request: Request,
  context: { params: any } 
) {
  try {
    const awaitedParams = await context.params;
    const { ticker: rawTicker } = awaitedParams;

    if (!rawTicker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }
    
    const ticker = rawTicker.toUpperCase();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // --- UPDATED: Fetch from Yahoo and Firestore in parallel ---
    const [quote, chartResult, searchResult, sentimentSnap] = await Promise.all([
      yahooFinance.quote(ticker),
      yahooFinance.chart(ticker, {
        period1: sixMonthsAgo,
        period2: new Date(),
        interval: '1d',
      }),
      yahooFinance.search(ticker, { newsCount: 5 }),
      // --- NEW: Fetch sentiment doc using Admin SDK syntax ---
      db.collection('sentiment').doc(ticker).get()
    ]);
    // --- END UPDATED ---

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

    const priceHistory: { name: string; price: number }[] = historicalQuotes.map((q: any) => ({
      name: new Date(q.date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      price: q.close ?? q.adjclose ?? 0,
    }));

    // Format news and assign mock sentiment
    const recentNews = recentNewsRaw.map((item: any) => ({
      id: item.uuid,
      headline: item.title,
      source: item.publisher,
      timestamp: new Date(item.providerPublishTime).toLocaleString(),
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)], 
    }));

    // --- UPDATED KEY STATS with more data points ---
    const keyStats = {
      'Prev. Close': quote.regularMarketPreviousClose?.toFixed(2) ?? 'N/A', 
      // --- FIX: Corrected 'N/IA' typo to 'N/A' ---
      'Market Cap': quote.marketCap?.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short' }) ?? 'N/A',
      'Enterprise Value': quote.enterpriseValue?.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short' }) ?? 'N/A',
      'Beta (5Y)': quote.beta?.toFixed(2) ?? 'N/A',
      '52 Week High': quote.fiftyTwoWeekHigh?.toFixed(2) ?? 'N/A',
      '52 Week Low': quote.fiftyTwoWeekLow?.toFixed(2) ?? 'N/A',
      'P/E Ratio (TTM)': quote.trailingPE?.toFixed(2) ?? 'N/A',
      'P/S Ratio': quote.priceToSales?.toFixed(2) ?? 'N/A',
      'Avg. Volume': quote.averageDailyVolume3Month?.toLocaleString() ?? 'N/A',
    };
    // --- END UPDATED KEY STATS ---

    // --- NEW MOCK DATA: Financial Ratios (Premium) ---
    const financialRatios = {
        'P/E Ratio': { value: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A', rating: quote.trailingPE && quote.trailingPE < 25 ? 'Strong' : quote.trailingPE && quote.trailingPE > 45 ? 'Weak' : 'Neutral' },
        'Debt/Equity': { value: 0.52, rating: 'Strong' },
        'Current Ratio': { value: 1.89, rating: 'Strong' },
        'ROE': { value: '15.4%', rating: 'Neutral' },
        'Gross Margin': { value: '42.1%', rating: 'Strong' },
        'EBITDA': { value: quote.ebitda ? quote.ebitda.toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short' }) : 'N/A', rating: 'Strong' },
    };
    
    // --- NEW MOCK DATA: Technical Indicators (Premium) ---
    const technicalIndicators = {
        'RSI (14)': { value: 68.5, signal: 'Hold' as TechnicalSignal },
        'MACD': { value: 1.25, signal: 'Buy' as TechnicalSignal },
        'SMA (50)': { value: quote.fiftyDayAverage?.toFixed(2) ?? 'N/A', signal: 'Buy' as TechnicalSignal },
        'SMA (200)': { value: quote.twoHundredDayAverage?.toFixed(2) ?? 'N/A', signal: 'Buy' as TechnicalSignal },
        'Stochastics': { value: 85.1, signal: 'Sell' as TechnicalSignal },
    };
    // --- END NEW MOCK DATA ---
    

    // --- Mocked AI Data (Enhanced) ---
    const aiSummary = `${
        quote.longName || ticker
      } is currently showing a strong positive sentiment trend driven by recent product announcements and better-than-expected earnings projections. The AI detects a low correlation between current price and overall social media volume, suggesting the positive shift is news-driven rather than speculative chatter.`;
      
    const aiInsights = [
        {
          id: 1,
          insight: 'Technical analysis indicates the 50-day moving average is crossing the 200-day, a classic "Golden Cross" buy signal.',
          type: 'technical',
        },
        {
          id: 2,
          insight: 'Social media volume is 30% below the 30-day average, suggesting a low-risk entry point relative to media hype.',
          type: 'social',
        },
        {
          id: 3,
          insight: 'Analyst ratings have been upgraded 4 times in the last 60 days, showing strong institutional confidence.',
          type: 'correlation',
        },
    ];
    // --- End Mocked AI Data ---

    // --- NEW: Process Real Sentiment Data ---
    let sentimentScore = 0; // Default score
    let sentimentLabel = 'Neutral'; // Default label

    // --- UPDATED: Use Admin SDK's '.exists' property ---
    if (sentimentSnap.exists) {
      const sentimentData = sentimentSnap.data();
      if (sentimentData) {
        sentimentScore = sentimentData.score ?? 0;
        sentimentLabel = getSentimentLabel(sentimentScore);
      }
    }
    // --- END NEW ---


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
      financialRatios: financialRatios as StockDetailData['financialRatios'],
      technicalIndicators: technicalIndicators as StockDetailData['technicalIndicators'],
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
  } catch (error: any) {
    console.error('API Error:', error.message, error.stack);
    if (error.message.includes('404')) {
      return NextResponse.json(
        { error: `Stock data not found for ${context.params.ticker}` },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch stock data from Yahoo Finance' },
      { status: 500 }
    );
  }
}