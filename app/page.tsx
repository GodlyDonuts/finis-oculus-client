// app/page.tsx

"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LandingNavbar } from "@/components/LandingNavbar";
import { LandingFooter } from "@/components/LandingFooter";
import StockCard from "@/components/StockCard";
import { HeroVisual } from "@/components/HeroVisual";

// --- NEW COMPONENT IMPORTS ---
import { SocialProof } from "@/components/SocialProof";
import { BentoGrid } from "@/components/BentoGrid";
import { HowItWorks } from "@/components/HowItWorks"; // <-- NEW
import { Testimonials } from "@/components/Testimonials";
// --- END NEW IMPORTS ---

import {
  Zap,
  Check,
} from "lucide-react";

// --- Mock Data for "Live" Demo (Unchanged) ---
const mockAAPL = {
  ticker: "AAPL",
  name: "Apple Inc.",
  price: 189.99,
  sentiment: 0.75,
  sparkline: [180, 182, 181, 184, 186, 185, 189],
};

// --- Animation Variants (Unchanged) ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring" },
  },
} as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-grow">
        {/* --- 1. Hero Section (Largely Unchanged) --- */}
        <section className="relative overflow-hidden pt-32 pb-40 md:pt-48 md:pb-64">
          {/* Background Visual */}
          <div className="absolute inset-0 z-0 h-full w-full">
            <HeroVisual />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary shadow-sm hover:bg-primary/20">
                <Zap className="mr-2 h-4 w-4 fill-primary/50" />
                Stop Guessing. Start Acting.
              </span>
            </motion.div>
            
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-6 max-w-5xl font-serif-display text-6xl font-extrabold tracking-tight text-gradient-hero md:text-8xl lg:text-9xl"
            >
              The AI Co-pilot for Your Market Edge.
            </motion.h1>
            
            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground md:text-2xl"
            >
              Finis Oculus turns the chaos of market sentiment into a single,
              actionable <strong>Trade Signal</strong>, giving you the first-mover advantage.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-lg shadow-primary/30 shadow-xl" asChild>
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                <Link href="#features">See The Difference</Link>
              </Button>
            </motion.div>

            {/* Product Mockup (Dashboard Preview) - Enhanced */}
            <motion.div 
              className="mx-auto mt-20 w-full max-w-6xl p-2 md:p-4 rounded-3xl bg-secondary/20 shadow-2xl shadow-black/30 dark:shadow-primary/10"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            >
              {/* This is a mock of the dashboard view */}
              <Card className="rounded-2xl border-2 border-border/50 bg-card/70 backdrop-blur-md p-6">
                <div className="flex justify-between items-center border-b border-border/50 pb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        <span className="text-lg font-semibold">Live Sentiment Dashboard</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <div className="pulse-live mr-2 h-3 w-3 rounded-full bg-green-500" />
                        Real-time Data Stream
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
                    <StockCard {...mockAAPL} />
                    {/* Mock for a Price Flash Animation */}
                    <Card className="flex flex-col items-center justify-center p-6 transition-all flash-green hover:border-primary/50 bg-card">
                        <p className="text-4xl font-extrabold text-green-500">+1.25</p>
                        <p className="text-sm text-muted-foreground">MSFT Sentiment Score</p>
                    </Card>
                    <Card className="flex flex-col items-center justify-center p-6 transition-all hover:border-primary/50 bg-card">
                        <p className="font-serif-display text-4xl font-extrabold text-red-500">SELL</p>
                        <p className="text-sm text-muted-foreground">TSLA Trade Signal</p>
                    </Card>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* --- 2. Social Proof Section (Unchanged) --- */}
        <SocialProof />

        {/* --- 3. Bento Grid Section (Unchanged) --- */}
        <BentoGrid />

        {/* --- 4. NEW How It Works Section --- */}
        <HowItWorks />

        {/* --- 5. Pricing Section (Unchanged) --- */}
        <motion.section
          id="pricing"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="bg-muted/50 py-24" 
        >
             <div className="container mx-auto flex flex-col items-center px-4">
                 <div className="mb-12 text-center">
                    <h2 className="font-serif-display text-4xl font-bold text-gradient-hero md:text-5xl">
                       Find Your Edge. Choose Your Plan.
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
                       Start with Free, upgrade to get the full power of AI.
                    </p>
                 </div>
            
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* 1. Free Plan */}
                    <Card className="shadow-lg bg-card">
                        <CardHeader className="items-center border-b border-border/50 pb-6">
                            <CardTitle className="text-3xl font-bold">Free</CardTitle>
                            <p className="mt-2 text-5xl font-extrabold">$0</p>
                            <p className="text-sm text-muted-foreground">/ forever</p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6 pt-6">
                            <ul className="w-full space-y-3">
                              <li className="flex items-start gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                <p>Real-time AI Sentiment Scores</p>
                              </li>
                              <li className="flex items-start gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                <p>AI-Generated Insights (Basic)</p>
                              </li>
                              <li className="flex items-start gap-2 text-muted-foreground">
                                <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                                <p>Watchlist & Price Charting</p>
                              </li>
                              <li className="flex items-start gap-2 opacity-50 text-muted-foreground">
                                <Check className="h-5 w-5 flex-shrink-0 text-gray-500" />
                                <p>Basic Key Statistics</p>
                              </li>
                            </ul>
                            <Button size="lg" variant="outline" className="w-full" asChild>
                                <Link href="/signup">Start Free Trial</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 2. Premium Plan (Highlighted) */}
                    <Card className="md:col-span-2 relative transform scale-[1.05] border-2 border-primary shadow-2xl shadow-primary/30">
                        <CardHeader className="items-center border-b border-border/50 pb-6">
                            <div className="mb-2 rounded-full bg-primary/20 px-3 py-1 text-sm font-semibold text-primary">
                               BEST VALUE
                            </div>
                            <CardTitle className="font-serif-display text-4xl font-bold">Finis Oculus Premium</CardTitle>
                            <p className="mt-2 text-6xl font-extrabold text-primary">
                                $10
                                <span className="text-xl font-normal text-muted-foreground">
                                    / month
                                </span>
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-6 pt-6">
                            <div className="flex items-center justify-center gap-4 rounded-xl border-2 border-dashed border-primary/50 bg-primary/10 p-4">
                               <Zap className="h-7 w-7 fill-primary/50 text-primary pulse-live" />
                               <p className="text-xl font-bold text-foreground">PROPRIETARY AI TRADE SIGNALS</p>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3">
                                <ul className="w-full space-y-3">
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p>Everything in Free</p>
                                    </li>
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p><strong>FULL</strong> AI Financial Scorecard</p>
                                    </li>
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p>Advanced Technical Analysis</p>
                                    </li>
                                </ul>
                                <ul className="w-full space-y-3">
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p>Historical Sentiment Trends</p>
                                    </li>
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p>Detailed Key Stats & Ratios</p>
                                    </li>
                                    <li className="flex items-start gap-2 font-medium text-foreground">
                                        <Check className="h-5 w-5 flex-shrink-0 text-primary" />
                                        <p>Priority AI Model Access</p>
                                    </li>
                                </ul>
                            </div>
                            <Button size="lg" className="w-full shadow-xl shadow-primary/30 transition-all bg-primary hover:bg-primary/90" asChild>
                                <Link href="/signup">Unlock All Features</Link>
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                $100 billed annually (Save 17%)
                            </p>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </motion.section>

        {/* --- 6. Testimonials Section (Unchanged) --- */}
        <Testimonials />

        {/* --- 7. Final CTA Section (Unchanged) --- */}
        <section className="py-24">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="font-serif-display text-4xl font-bold text-gradient-hero md:text-5xl">
              Ready to Stop Trading on Hype?
            </h2>
            <p className="max-w-lg text-lg text-muted-foreground">
              Sign up in 30 seconds and gain the AI-driven edge professional traders use. No credit card required for the free plan.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}