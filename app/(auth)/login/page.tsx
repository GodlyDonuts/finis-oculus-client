"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
// Import Google auth providers
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); //
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- New Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign in with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };
  // --- End New Handler ---

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column: Form */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <Card className="w-full max-w-sm">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="font-serif-display text-3xl">
                Login
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* --- New Google Button --- */}
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
              >
                {/* You can add a Google icon here */}
                {isGoogleLoading
                  ? "Signing in..."
                  : "Sign in with Google"}
              </Button>
              {/* --- Separator --- */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* --- End New Additions --- */}
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Column: Branded Element */}
      <div className="hidden items-center justify-center bg-muted p-12 md:flex md:w-1/2">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            alt="Finis Oculus Logo"
            width={64}
            height={64}
            className="dark:invert"
          />
          <span className="font-serif-display mt-4 text-4xl font-semibold text-foreground">
            Finis Oculus
          </span>
          <p className="mt-4 text-lg text-muted-foreground">
            Clarity in the chaos of market sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}