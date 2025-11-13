// components/PremiumGate.tsx

import { cn } from "@/lib/utils";
import { Lock, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Card } from "./ui/card"; // Import Card
// --- NEW ---
// Import the useAuth hook to get the real premium status
import { useAuth } from "@/context/authcontext";

// --- UPDATED ---
// The 'isPremium' prop is no longer needed, as we get it from the context.
interface PremiumGateProps {
  children: React.ReactNode;
  featureName: string;
}

export function PremiumGate({ children, featureName }: PremiumGateProps) {
  // --- NEW ---
  // Get the real premium status from our AuthContext
  const { isPremium } = useAuth();
  // --- END NEW ---

  // --- UPDATED ---
  // Use the real 'isPremium' value here
  if (isPremium) {
    return <>{children}</>;
  }

  // This is the gate/paywall that non-premium users will see
  return (
    <div className="relative">
      {/* 1. Blurred Content (The Tease) */}
      <div className={cn("pointer-events-none transition-all", { "blur-sm grayscale": !isPremium })}>
        {children}
      </div>

      {/* 2. Overlay (The Gate) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
        <Card className="z-20 w-full p-6 text-center shadow-2xl border-primary/50 bg-card/95">
          <Lock className="mx-auto h-8 w-8 text-primary" />
          <h3 className="mt-3 font-serif-display text-2xl font-bold">
            {featureName} (Premium)
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Unlock proprietary insights, AI signals, and deep financial analysis.
          </p>
          <Button className="mt-4 w-full" size="lg" asChild>
            <Link href="/signup#pricing">
              <Zap className="mr-2 h-5 w-5 fill-white" />
              Upgrade to Premium
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}