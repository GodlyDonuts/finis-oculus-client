import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/50">
      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-16 md:grid-cols-4">
        {/* Column 1: Brand */}
        <div className="col-span-2 flex flex-col gap-4 md:col-span-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-foreground"
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
          <p className="max-w-xs text-sm text-muted-foreground">
            AI-powered market intelligence to cut through the noise.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        {/* Column 2: Product */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">Product</h3>
          <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#tech" className="text-sm text-muted-foreground hover:text-foreground">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </div>

        {/* Column 3: Company */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">Company</h3>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            About Us
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Careers
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </div>

        {/* Column 4: Legal */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-foreground">Legal</h3>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
            Terms of Service
          </Link>
        </div>
      </div>
      
      <div className="border-t border-border/50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finis Oculus. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}