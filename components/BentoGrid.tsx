// components/BentoGrid.tsx

"use client";
import { motion } from "framer-motion";
import { BentoCard } from "./BentoCard";
import {
  Zap,
  BrainCircuit,
  ScanSearch,
  Scale,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Card } from "./ui/card"; // Using the existing UI card for mockups

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", staggerChildren: 0.1 },
  },
} as const;

export function BentoGrid() {
  return (
    <motion.section
      id="features"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="bg-muted/50 py-32"
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="text-sm uppercase font-semibold text-primary/70">
            The Finis Oculus Difference
          </span>
          <h2 className="font-serif-display mt-2 text-4xl font-bold text-gradient-hero md:text-5xl">
            One Dashboard, Total Clarity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our platform combines all the tools you need into a single,
            intelligent interface.
          </p>
        </div>

        {/* --- The Bento Grid --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Main Feature: AI Trade Signal (Large) */}
          <BentoCard className="lg:col-span-2 lg:row-span-2 border-2 border-primary shadow-primary/30">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">
                Proprietary AI Trade Signal
              </h3>
            </div>
            <p className="text-muted-foreground">
              Our system combines sentiment, technicals, and financials into
              a single, unambiguous <strong>BUY/SELL</strong> rating.
            </p>
            {/* Mockup */}
            <Card className="p-8 border-2 border-green-500/50 shadow-xl shadow-green-500/10 bg-card/70">
              <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-medium tracking-widest uppercase text-green-500">
                  Proprietary Signal (AAPL)
                </p>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="font-serif-display mt-2 text-8xl font-extrabold text-green-500"
                >
                  BUY
                </motion.div>
                <p className="mt-2 text-center text-lg text-muted-foreground">
                  Based on <strong>Golden Cross</strong> and <strong>Strong Sentiment (+0.82)</strong>.
                </p>
              </div>
            </Card>
          </BentoCard>

          {/* 2. Financial Scorecard (Medium) */}
          <BentoCard className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Financial Scorecard</h3>
            </div>
            <p className="text-muted-foreground">
              Proprietary ratings (P/E, D/E, ROE) benchmarked against sector
              peers.
            </p>
            {/* Mockup */}
            <div className="flex gap-4">
              <Card className="flex-1 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Scale className="h-5 w-5" /> Scorecard
                </div>
                <p className="mt-2 text-xl font-bold text-green-500">Strong</p>
                <p className="text-xs text-muted-foreground">Overall Rating</p>
              </Card>
              <Card className="flex-1 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <BarChart3 className="h-5 w-5" /> Technicals
                </div>
                <p className="mt-2 text-xl font-bold text-green-500">Buy</p>
                <p className="text-xs text-muted-foreground">Overall Signal</p>
              </Card>
            </div>
          </BentoCard>

          {/* 3. Massive Ingestion (Small) */}
          <BentoCard>
            <div className="flex items-center gap-3">
              <ScanSearch className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Massive Ingestion</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Indexes 100k+ data sources in real-time.
            </p>
            <div className="flex items-end justify-center h-full">
                <BarChart3 className="w-2/3 h-auto text-primary/30" strokeWidth={1} />
            </div>
          </BentoCard>

          {/* 4. Deep Correlation (Small) */}
          <BentoCard>
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">Deep Correlation</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI correlates sentiment with price, volatility, and more.
            </p>
             <div className="flex items-end justify-center h-full">
                <TrendingUp className="w-2/3 h-auto text-primary/30" strokeWidth={1} />
            </div>
          </BentoCard>

          {/* 5. Peer Benchmarking (Medium) */}
          <BentoCard className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Peer Benchmarking</h3>
            </div>
            <p className="text-muted-foreground">
              See how a stock's ratios stack up against its direct
              competitors and sector medians.
            </p>
            {/* Mockup */}
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-4 items-center gap-2 text-sm">
                    <span className="font-semibold">AAPL</span>
                    <span className="text-green-500">22.5x</span>
                    <span className="text-muted-foreground">vs. Sector Avg</span>
                    <span className="text-red-500">28.1x</span>
                </div>
                 <div className="grid grid-cols-4 items-center gap-2 text-sm">
                    <span className="font-semibold">MSFT</span>
                    <span className="text-green-500">24.2x</span>
                    <span className="text-muted-foreground">vs. Sector Avg</span>
                    <span className="text-red-500">28.1x</span>
                </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </motion.section>
  );
}