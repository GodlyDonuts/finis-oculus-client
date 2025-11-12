// components/SocialProof.tsx

"use client";
import { motion } from "framer-motion";
import { Briefcase, Building, BarChart4, Globe2, Bot } from "lucide-react";

// Placeholder logos
const logos = [
  { name: "QuantumFund", icon: Bot },
  { name: "Momentum", icon: BarChart4 },
  { name: "Apex Capital", icon: Building },
  { name: "Global Edge", icon: Globe2 },
  { name: "Private Wealth", icon: Briefcase },
];

export function SocialProof() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="py-16 md:py-24"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="mb-8 text-lg font-medium text-muted-foreground">
          Trusted by the world's most innovative traders and funds
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {logos.map((logo) => {
            const Icon = logo.icon;
            return (
              <div
                key={logo.name}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-6 w-6" />
                <span className="text-xl font-semibold">{logo.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}