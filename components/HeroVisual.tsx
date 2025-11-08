"use client";
import { motion } from "framer-motion";

export function HeroVisual() {
  // TODO: Replace this div with your react-three-fiber Canvas
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5, type: "spring" }}
      className="relative h-64 w-64"
    >
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute inset-8 rounded-full bg-primary/20 blur-2xl" />
      <div className="absolute inset-16 h-32 w-32 rounded-full bg-primary/80 shadow-2xl shadow-primary/50" />
      <div className="absolute inset-0 animate-pulse rounded-full border-2 border-primary/50" />
      <div
        style={{ animationDelay: "1s" }}
        className="absolute inset-4 animate-pulse rounded-full border border-primary/30"
      />
    </motion.div>
  );
}