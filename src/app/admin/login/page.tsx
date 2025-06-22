
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <Shield className="h-8 w-8" />
                </div>
            </div>
            <CardTitle className="font-headline text-4xl">Admin Panel</CardTitle>
            <CardDescription>Please log in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  <Link href="/admin">Login</Link>
                </Button>
              </div>
            </div>
             <div className="mt-4 text-center text-sm">
              Not an admin?{" "}
              <Link href="/" className="underline text-primary font-medium">
                Go to student login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
