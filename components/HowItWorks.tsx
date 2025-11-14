// components/HowItWorks.tsx

"use client";
import { motion } from "framer-motion";
import { ScanSearch, BrainCircuit, Zap } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, type: "spring", staggerChildren: 0.1 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const steps = [
  {
    icon: ScanSearch,
    title: "1. Massive Ingestion",
    description:
      "Our model continuously scans and indexes over 100,000+ real-time data sources, from news and SEC filings to social media and blogs.",
  },
  {
    icon: BrainCircuit,
    title: "2. Deep Correlation",
    description:
      "The AI goes beyond simple keywords. It identifies true sentiment and correlates it with price history, volatility, and financial health.",
  },
  {
    icon: Zap,
    title: "3. Actionable Signal",
    description:
      "All of this is distilled into a single, unambiguous rating. A definitive BUY, SELL, or HOLD signal, letting you act with confidence.",
  },
];

export function HowItWorks() {
  return (
    <motion.section
      id="tech" // This ID is for the navbar link
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="py-32" // Switched bg-muted off for a clean break
    >
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <span className="text-sm uppercase font-semibold text-primary/70">
            Proprietary Model
          </span>
          <h2 className="font-serif-display mt-2 text-4xl font-bold text-gradient-hero md:text-5xl">
            How Chaos Becomes a Signal
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Our 3-step AI pipeline is custom-built for financial markets.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                variants={cardVariants}
                className="flex flex-col"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary border-2 border-primary/20 mb-6">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}