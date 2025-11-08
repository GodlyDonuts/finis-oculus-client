"use client";
import { useState } from "react";
import Link from "next/link";
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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Add Firebase signup logic here
    console.log("Signing up with:", email, password);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column: Form */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <Card className="w-full max-w-sm">
          <form onSubmit={handleSignup}>
            <CardHeader>
              <CardTitle className="text-3xl">Create Account</CardTitle>
              <CardDescription>
                Enter your email and password to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Column: Branded Element */}
      <div className="hidden items-center justify-center bg-muted p-12 md:flex md:w-1/2">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-foreground">
            Finis Oculus
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Clarity in the chaos of market sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}