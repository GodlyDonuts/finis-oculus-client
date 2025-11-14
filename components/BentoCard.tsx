// components/BentoCard.tsx

"use client";
import { motion, HTMLMotionProps } from "framer-motion"; // 1. Import HTMLMotionProps
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const; // 3. Add 'as const'

// 2. Extend HTMLMotionProps instead. It already includes 'className' and 'children'.
interface BentoCardProps extends HTMLMotionProps<"div"> {}

export function BentoCard({ className, children, ...props }: BentoCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "relative flex flex-col justify-between gap-6 rounded-2xl border border-border/50 bg-card/70 p-6 shadow-lg backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}