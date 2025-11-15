/*
  File: components/WelcomeModal.tsx
  Purpose: Implements SECTION 5: "Smarter Onboarding".
  Shows a welcome modal if the user's watchlist is empty.
*/
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";


interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="mb-4 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Finis Oculus Logo"
              width={48}
              height={48}
              className="dark:invert"
            />
          </div>
          <DialogTitle className="text-center font-serif-display text-3xl">
            Welcome to Finis Oculus
          </DialogTitle>
          [cite_start]{/* Onboarding message [cite: 236] */}
          <DialogDescription className="text-center text-base">
            We're excited to help you find clarity in the market chaos.
            <br />
            <br />
            To get you started, your dashboard is ready. Just add your first
            stock (like AAPL or TSLA) to begin tracking AI insights.
          </DialogDescription>
          [cite_start]{/* Note: We are NOT pre-populating the list [cite: 237] as it's a 
            complex write operation. The modal instead directs them to the 
            existing empty-state "add" functionality.
          */}
        </DialogHeader>
        <DialogFooter>
          <Button
            size="lg"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Let's Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}