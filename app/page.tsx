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
import {
  Zap,
  TrendingDown,
  AlertOctagon,
  ScanSearch,
  BrainCircuit,
  BarChartBig,
  Layers,
  FlaskConical,
} from "lucide-react";

// --- Mock Data for "Live" Demo ---
const mockAAPL = {
  ticker: "AAPL",
  name: "Apple Inc.",
  price: 189.99,
  sentiment: 0.75,
  sparkline: [180, 182, 181, 184, 186, 185, 189],
};

// --- Animation Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <LandingNavbar />

      <main className="flex-grow pt-16">
        {/* --- 1. Hero Section --- */}
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 md:grid-cols-2">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-center md:items-start md:text-left"
            >
              <h1 className="font-serif-display text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                See the Market's Next Move Before It Happens.
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground md:text-xl">
                Finis Oculus cuts through market noise with an AI-powered
                co-pilot, turning millions of articles and posts into a
                single, actionable sentiment score.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Hero Visual (The "Hook") */}
            <div className="flex justify-center md:justify-end">
              <HeroVisual />
            </div>
          </div>
          {/* Background Gradient */}
          <div className="absolute top-0 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </section>

        {/* --- 2. Social Proof / Testimonial --- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="py-24"
        >
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <blockquote className="text-2xl font-medium italic text-foreground md:text-3xl">
              "Finis Oculus is the co-pilot I've always wanted. It's the only
              tool that cuts through the noise and gives me a clear signal."
            </blockquote>
            <p className="mt-6 text-base font-semibold text-muted-foreground">
              — Early Beta Tester
            </p>
          </div>
        </motion.section>

        {/* --- 3. The Problem Section --- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="bg-muted py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
                The Market is a Firehose of Noise
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                How do you find the real signal?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="bg-background">
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4">Information Overload</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Millions of articles, tweets, and reports. It's
                    impossible for a human to keep up.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader>
                  <TrendingDown className="h-8 w-8 text-destructive" />
                  <CardTitle className="mt-4">Hidden Traps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sentiment shifts in minutes. By the time you read the
                    news, the opportunity is gone.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background">
                <CardHeader>
                  <AlertOctagon className="h-8 w-8 text-yellow-500" />
                  <CardTitle className="mt-4">Biased Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Mainstream news is slow. Social media is biased. We
                    filter both to find the ground truth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* --- 4. The Solution / "How it Works" --- */}
        <motion.section
          id="tech"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="py-32"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
                We Turn Chaos into Clarity
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Our 3-step proprietary AI engine.
              </p>
            </div>
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
              {/* Dashed Line Connector */}
              <div className="absolute top-1/2 left-0 -z-10 hidden w-full -translate-y-1/2 border-t-2 border-dashed border-border md:block" />
              
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ScanSearch className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold">1. Aggregate</h3>
                <p className="text-muted-foreground">
                  We monitor 100,000+ data sources in real-time, from top-tier
                  outlets to niche financial blogs.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold">2. Analyze</h3>
                <p className="text-muted-foreground">
                  Our AI reads, understands, and scores sentiment, relevance,
                  and impact for every piece of content.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BarChartBig className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-semibold">3. Visualize</h3>
                <p className="text-muted-foreground">
                  You get a simple, actionable score and the key insights
                  driving the sentiment.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- 5. Features Section --- */}
        <motion.section
          id="features"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="bg-muted py-24"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
                Your New AI-Powered Co-pilot
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                All the tools you need to find your edge.
              </p>
            </div>
            {/* Feature 1: Live Demo */}
            <motion.div
              variants={cardVariants}
              className="grid grid-cols-1 items-center gap-12 md:grid-cols-2"
            >
              <div>
                <h3 className="mb-4 text-3xl font-semibold">
                  Real-Time Sentiment Tracking
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Don't wait for market open. Our dashboard updates in
                  real-time, with live-updating prices and sentiment scores
                  on your entire watchlist. See the market shift as it
                  happens.
                </p>
              </div>
              <div className="pointer-events-none">
                <StockCard {...mockAAPL} />
              </div>
            </motion.div>
            
            {/* Feature 2: AI Insights */}
            <motion.div
              variants={cardVariants}
              className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2"
            >
              <div className="order-2 md:order-1">
                <Image
                  src="/feature-ai-insights.png" // Placeholder
                  alt="AI Generated Insights"
                  width={1200}
                  height={1000}
                  className="rounded-xl border shadow-lg"
                />
                {/* Note: Create a screenshot of your AI Insights card and name it 'feature-ai-insights.png' in /public */}
              </div>
              <div className="order-1 md:order-2">
                <h3 className="mb-4 text-3xl font-semibold">
                  AI-Generated Insights
                </h3>
                <p className="text-muted-foreground">
                  Go beyond the score. Our AI summarizes *why* sentiment is
                  positive or negative, correlating news, technicals, and
                  social volume into plain-English insights.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* --- 6. The Tech Section (For Investors) --- */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="py-32"
        >
          <div className="container mx-auto max-w-5xl px-4">
            <div className="mb-16 text-center">
              <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
                Beyond the Hype: Our Proprietary Engine
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                This isn't just a wrapper. We built a defensible moat.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 text-center">
                <Layers className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-semibold">
                  Custom Transformer Models
                </h3>
                <p className="text-muted-foreground">
                  We fine-tune our models on terabytes of financial data to
                  understand the specific, nuanced language of markets.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <FlaskConical className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-semibold">
                  Cross-Correlated Analysis
                </h3>
                <p className="text-muted-foreground">
                  Our system tracks how a single story cascades across
                  different media, from blogs to social to mainstream news.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <Zap className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-semibold">Anomaly Detection</h3>
                <p className="text-muted-foreground">
                  Our system flags unusual sentiment or volume shifts *before*
                  they hit the mainstream, giving you the first-mover
                  advantage.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* --- 7. Pricing Section --- */}
        <motion.section
          id="pricing"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="bg-muted py-24"
        >
          <div className="container mx-auto flex flex-col items-center px-4">
            <div className="mb-12 text-center">
              <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
                Get Started Today
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
                Join our free public beta and get your unfair advantage.
              </p>
            </div>
            
            <Card className="max-w-md bg-background shadow-xl">
              <CardHeader className="items-center">
                <CardTitle className="text-2xl">Public Beta</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <p className="text-5xl font-bold">
                  $0
                  <span className="text-lg font-normal text-muted-foreground">
                    / forever
                  </span>
                </p>
                <ul className="w-full list-inside list-disc space-y-2 text-muted-foreground">
                  <li>Unlimited Watchlists</li>
                  <li>Real-time AI Sentiment Scores</li>
                  <li>AI-Generated Insights</li>
                  <li>Sentiment-Driving News Feed</li>
                </ul>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/signup">Join the Beta</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* --- 8. Final CTA Section --- */}
        <section className="py-32">
          <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
            <h2 className="font-serif-display text-4xl font-bold md:text-5xl">
              Get Your Unfair Advantage
            </h2>
            <p className="max-w-lg text-lg text-muted-foreground">
              Sign up in 30 seconds and see the market in a new light. No
              credit card required.
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}