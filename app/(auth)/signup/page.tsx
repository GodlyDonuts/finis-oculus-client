// app/(auth)/signup/page.tsx

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
// --- UPDATED IMPORTS ---
import {
  createUserWithEmailAndPassword, // Changed from signIn
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
// Import Firestore db and functions
import { db } from "@/app/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
// --- END IMPORTS ---
import { HeroVisual } from "@/components/HeroVisual"; // Import the new visual
import { GoogleIcon } from "@/components/GoogleIcon"; // Import the new icon

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); //
  const router = useRouter();

  // --- UPDATED: Email Signup Handler ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Create the user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        isPremium: false,
        // Add any other default fields here
      });

      toast.success("Account created! Redirecting to dashboard.");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      // Provide better error messages
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use. Please log in.");
      } else {
        toast.error("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- UPDATED: Google Sign-In Handler ---
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // --- NEW: Check if user doc already exists ---
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // This is a new user, create their document
        await setDoc(userDocRef, {
          email: user.email,
          isPremium: false,
          // Add any other default fields here
        });
        toast.success("Account created! Redirecting to dashboard.");
      } else {
        // This is a returning user, just log them in
        toast.success("Welcome back!");
      }
      // --- END NEW CHECK ---

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
      <div className="flex w-full items-center justify-center p-8 md:w-1/2 lg:w-2/5">
        <Card className="w-full max-w-sm">
          {/* Use the new handleSignup handler */}
          <form onSubmit={handleSignup}>
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center md:hidden">
                <Image
                  src="/logo.svg"
                  alt="Finis Oculus Logo"
                  width={48}
                  height={48}
                  className="dark:invert"
                />
              </div>
              <CardTitle className="font-serif-display text-3xl">
                Create Account
              </CardTitle>
              <CardDescription>
                Enter your email below to create your AI-powered account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {/* --- Google Button --- */}
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}
              >
                <GoogleIcon className="mr-2 h-5 w-5" />
                {isGoogleLoading
                  ? "Signing up..."
                  : "Sign up with Google"}
              </Button>
              {/* --- Separator --- */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              {/* --- End Additions --- */}
              
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
                size="lg"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Column: Branded Element */}
      <div className="relative hidden items-center justify-center overflow-hidden p-12 md:flex md:w-1/2 lg:w-3/5">
        {/* The new HeroVisual as a background */}
        <div className="absolute inset-0 z-0">
          <HeroVisual />
        </div>
        
        {/* Content on top */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            alt="Finis Oculus Logo"
            width={64}
            height={64}
            className="dark:invert"
          />
          <span className="font-serif-display mt-4 text-4xl font-semibold text-white shadow-black/50 [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">
            Finis Oculus
          </span>
          <p className="mt-4 max-w-sm text-lg text-gray-200 shadow-black/50 [text-shadow:_0_1px_2px_var(--tw-shadow-color)]">
            Clarity in the chaos of market sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}