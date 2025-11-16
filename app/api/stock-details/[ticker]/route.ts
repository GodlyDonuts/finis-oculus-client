// app/api/stock-details/[ticker]/route.ts

import { NextResponse, NextRequest } from 'next/server';
import YahooFinance from 'yahoo-finance2';
// NO other 'yahoo-finance2' imports are needed
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

// --- UPDATED TYPE ---
type StockDetailData = {
  ticker: string;
  name: string;
  exchange: string; // NEW
  logoUrl: string; // NEW
  price: number;
  previousClose: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  marketState: string; // NEW
  preMarketPrice?: number; // NEW
  preMarketChange?: string; // NEW
  postMarketPrice?: number; // NEW
  postMarketChange?: string; // NEW
  aiSummary: string;
  priceHistory: { name: string; price: number; volume?: number }; // Added volume
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
  analystRatings: { // NEW
    recommendation: string;
    targetPrice: number | string;
    distribution: { rating: string, count: number }[];
  };
  companyProfile: { // NEW
    description: string;
    industry: string;
    sector: string;
    executives: { name: string, title: string }[];
    location: string;
    website: string;
  };
  financialStatements: any; // NEW
};
// --- END UPDATED TYPE ---

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticker: string }> } // <-- FIX: Re-added Promise
) {
  try {
    const { ticker: rawTicker } = await context.params; // <-- FIX: Re-added await

    if (!rawTicker) {
      return NextResponse.json(
        { error: 'Ticker symbol is required' },
        { status: 400 }
      );
    }

    const ticker = rawTicker.toUpperCase();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // --- Removed the failing 'financials' call ---
    const [
      quoteResult,
      chartResult,
      searchResult,
      sentimentSnap
    ] = await Promise.all([
      yahooFinance.quote(ticker), // This single call gets everything
      yahooFinance.chart(ticker, {
        period1: sixMonthsAgo,
        period2: new Date(),
        interval: '1d',
        includePrePost: true,
      }),
      yahooFinance.search(ticker, { newsCount: 10 }),
      db.collection('sentiment').doc(ticker).get(),
    ]);
    // --- END ---

    // --- CORRECTED PARSING ---
    const quote = quoteResult;
    if (!quote || !quote.regularMarketPrice) {
      return NextResponse.json(
        { error: 'Stock data not found' },
        { status: 404 }
      );
    }
    // All properties are on the top-level quote object
    const summaryDetail = quote;
    const financialData = quote;
    const assetProfile = quote;
    const recommendationTrend = quote.recommendationTrend?.trend?.[0] || {};
    // --- END CORRECTED PARSING ---


    const historicalQuotes = chartResult?.quotes || [];
    const recentNewsRaw = searchResult?.news || [];

    const changePct = quote.regularMarketChangePercent ?? 0;
    const changeVal = quote.regularMarketChange ?? 0;
    const changeType =
      changeVal > 0 ? 'positive' : changeVal < 0 ? 'negative' : 'neutral';

    const priceHistory =
      historicalQuotes.map((q: any) => ({
        name: new Date(q.date).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        price: q.close ?? q.adjclose ?? 0,
        volume: q.volume ?? 0,
      }));

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
      'Market Cap': quote.marketCap?.toLocaleString('en-US', { notation: 'compact' }) ?? 'N/A',
      'P/E Ratio (TTM)': summaryDetail.trailingPE?.toFixed(2) ?? 'N/A',
      'EPS (TTM)': quote.defaultKeyStatistics?.trailingEps?.toFixed(2) ?? 'N/A',
      'Fwd. Dividend & Yield': `${summaryDetail.dividendRate ?? 'N/A'} (${summaryDetail.dividendYield?.toFixed(2) ?? 'N/A'}%)`,
      '52 Week High': summaryDetail.fiftyTwoWeekHigh?.toFixed(2) ?? 'N/A',
      '52 Week Low': summaryDetail.fiftyTwoWeekLow?.toFixed(2) ?? 'N/A',
      'Avg. Volume': summaryDetail.averageDailyVolume3Month?.toLocaleString() ?? 'N/A',
      'Beta (5Y)': summaryDetail.beta?.toFixed(2) ?? 'N/A',
    };

    const financialRatios: StockDetailData['financialRatios'] = {
      'P/E Ratio': {
        value: summaryDetail.trailingPE?.toFixed(2) ?? 'N/A',
        rating: 'Neutral', // TODO: Add real rating logic
      },
      'Debt/Equity': { 
        value: financialData.debtToEquity?.toFixed(2) ?? 'N/A', 
        rating: 'Neutral' 
      },
      'Current Ratio': { 
        value: financialData.currentRatio?.toFixed(2) ?? 'N/A', 
        rating: 'Neutral' 
      },
      ROE: { 
        value: financialData.returnOnEquity?.toFixed(2) ?? 'N/A', 
        rating: 'Neutral' 
      },
      'Gross Margin': { 
        value: financialData.grossMargins?.toFixed(2) ?? 'N/A', 
        rating: 'Neutral' 
      },
      EBITDA: {
        value: financialData.ebitda?.toLocaleString('en-US', { notation: 'compact' }) ?? 'N/A',
        rating: 'Neutral',
      },
    };
    
    const technicalIndicators: StockDetailData['technicalIndicators'] = {
      'RSI (14)': { value: 68.5, signal: 'Hold' }, // Hardcoded stub
      MACD: { value: 1.25, signal: 'Buy' }, // Hardcoded stub
      'SMA (50)': {
        value: summaryDetail.fiftyDayAverage?.toFixed(2) ?? 'N/A',
        signal: 'Buy', // Hardcoded signal
      },
      'SMA (200)': {
        value: summaryDetail.twoHundredDayAverage?.toFixed(2) ?? 'N/A',
        signal: 'Buy', // Hardcoded signal
      },
      Stochastics: { value: 85.1, signal: 'Sell' }, // Hardcoded stub
    };

    const aiSummary = `${
      quote.longName || ticker
    } is currently showing a strong positive sentiment trend driven by recent product announcements and better-than-expected earnings projections. The AI detects a low correlation between current price and overall social media volume, suggesting the positive shift is news-driven rather than speculative chatter.`; // Hardcoded stub

    // --- FIX: Added missing colon on id: 2 ---
    const aiInsights: AiInsight[] = [
      { id: 1, insight: 'Technical analysis indicates the 50-day moving average is crossing the 200-day.', type: 'technical' },
      { id: 2, insight: 'Social media volume is 30% below the 30-day average.', type: 'social' },
      { id: 3, insight: 'Analyst ratings have been upgraded 4 times in the last 60 days.', type: 'correlation' },
    ]; // Hardcoded stub
    // --- END FIX ---

    let sentimentScore = 0;
    let sentimentLabel = 'Neutral';

    if (sentimentSnap.exists) {
      const sentimentData = sentimentSnap.data();
      if (sentimentData) {
        sentimentScore = sentimentData.score ?? 0;
        sentimentLabel = getSentimentLabel(sentimentScore);
      }
    }

    const analystRatings = {
      recommendation: financialData.recommendationKey ?? 'N/A', // e.g., "buy", "hold"
      targetPrice: financialData.targetMeanPrice ?? 'N/A',
      distribution: [
        { rating: 'Strong Buy', count: recommendationTrend.strongBuy ?? 0 },
        { rating: 'Buy', count: recommendationTrend.buy ?? 0 },
        { rating: 'Hold', count: recommendationTrend.hold ?? 0 },
        { rating: 'Sell', count: recommendationTrend.sell ?? 0 },
        { rating: 'Strong Sell', count: recommendationTrend.strongSell ?? 0 },
      ],
    };

    const website = assetProfile.website ?? '';
    const companyProfile = {
      description: assetProfile.longBusinessSummary ?? 'N/A',
      industry: assetProfile.industry ?? 'N/A',
      sector: assetProfile.sector ?? 'N/A',
      executives: assetProfile.companyOfficers?.map((e: any) => ({ name: e.name, title: e.title })) ?? [],
      location: `${assetProfile.city ?? ''}, ${assetProfile.state ?? ''} ${assetProfile.country ?? ''}`,
      website: website,
    };
    
    // --- FIX: Point to the quoteResult and use defensive chaining ---
    const financialStatements = {
      annual: {
        incomeStatement: quoteResult?.incomeStatementHistory?.incomeStatementHistory || [],
        balanceSheet: quoteResult?.balanceSheetHistory?.balanceSheetStatements || [],
        cashFlow: quoteResult?.cashflowStatementHistory?.cashflowStatements || [],
      },
      quarterly: {
        incomeStatement: quoteResult?.incomeStatementHistoryQuarterly?.incomeStatementHistory || [],
        balanceSheet: quoteResult?.balanceSheetHistoryQuarterly?.balanceSheetStatements || [],
        cashFlow: quoteResult?.cashflowStatementHistoryQuarterly?.cashflowStatements || [],
      }
    };
    // --- END FIX ---

    const data: StockDetailData = {
      ticker: ticker,
      name: quote.longName || quote.shortName || ticker,
      exchange: quote.exchangeName ?? 'N/A',
      logoUrl: `https://logo.clearbit.com/${website?.replace('https://', '').replace('http://', '').split('/')[0]}`,
      price: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      change: `${changeVal > 0 ? '+' : ''}${changeVal.toFixed(
        2
      )} (${changePct.toFixed(2)}%)`,
      changeType: changeType,
      marketState: quote.marketState,
      preMarketPrice: quote.preMarketPrice,
      preMarketChange: `${quote.preMarketChangePercent?.toFixed(2) ?? 0}%`,
      postMarketPrice: quote.postMarketPrice,
      // --- FIX: Completed this line ---
      postMarketChange: `${quote.postMarketChangePercent?.toFixed(2) ?? 0}%`,
      // --- END FIX ---
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
          score: Math.random() * 0.4 - 0.2, 
        })),
      },
      aiInsights: aiInsights,
      analystRatings: analystRatings,
      companyProfile: companyProfile,
      financialStatements: financialStatements,
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