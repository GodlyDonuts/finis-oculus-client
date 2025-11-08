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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add Firebase login logic here
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-black">
      {/* Left Column: Form */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <Card className="w-full max-w-sm">
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle className="text-3xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account.
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
                Login
              </Button>
              <p className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                >
                  Sign Up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Right Column: Branded Element */}
      <div className="hidden items-center justify-center bg-zinc-100 p-12 dark:bg-zinc-900 md:flex md:w-1/2">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-black dark:text-zinc-50">
            Finis Oculus
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Clarity in the chaos of market sentiment.
          </p>
        </div>
      </div>
    </div>
  );
}