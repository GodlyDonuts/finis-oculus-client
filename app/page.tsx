"use client"; // Add "use client" for Framer Motion
import Link from "next/link";
import { motion } from "framer-motion"; // Import motion
import { Button } from "@/components/ui/button"; // Import shadcn Button

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-16 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center gap-16 text-center">
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Finis Oculus
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            An AI-powered web application for analyzing market sentiment from news
            articles, social media, and financial reports.
          </p>
        </motion.div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}