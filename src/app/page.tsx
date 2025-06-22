"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <BookOpen className="h-8 w-8" />
                </div>
            </div>
            <CardTitle className="font-headline text-4xl">NoteVerse</CardTitle>
            <CardDescription>Welcome back! Please log in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline text-primary font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  <Link href="/home">Login as Student</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/login">
                    <Shield className="mr-2 h-4 w-4" />
                    Login as Admin
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="underline text-primary font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
