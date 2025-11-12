// components/LandingNavbar.tsx

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Zap,
  Scale,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { NavFeatureCard } from "./NavFeatureCard";

const features = [
  {
    title: "AI Trade Signal",
    description: "Our core Buy/Sell/Hold rating.",
    href: "#features",
    icon: Zap,
  },
  {
    title: "Financial Scorecard",
    description: "Deep-dive financial health analysis.",
    href: "#features",
    icon: Scale,
  },
  {
    title: "Technical Analysis",
    description: "RSI, MACD, and SMA signals.",
    href: "#features",
    icon: BarChart3,
  },
];

export function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* --- Desktop Navbar --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Image
              src="/logo.svg"
              alt="Finis Oculus Logo"
              width={32}
              height={32}
              className="dark:invert"
            />
            <span className="font-serif-display">Finis Oculus</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Features Megamenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  Features
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-screen max-w-xs p-4"
              >
                <div className="flex flex-col gap-2">
                  {features.map((feature) => (
                    <NavFeatureCard key={feature.title} {...feature} />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="#tech"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 h-screen bg-background/95 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="container mx-auto flex h-full flex-col px-8 pt-8 pb-24">
            {/* Mobile Feature Links */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-muted-foreground">
                Features
              </p>
              {features.map((feature) => (
                <NavFeatureCard
                  key={feature.title}
                  {...feature}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}
              <p className="text-sm font-semibold text-muted-foreground pt-4">
                Menu
              </p>
              <Link
                href="#tech"
                className="text-lg font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="text-lg font-medium text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>

            {/* Mobile Auth Buttons (at bottom) */}
            <div className="mt-auto flex flex-col gap-4">
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}