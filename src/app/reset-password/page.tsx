
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function ResetPasswordDisabledPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 text-destructive rounded-full p-3">
                    <AlertTriangle className="h-8 w-8" />
                </div>
            </div>
            <CardTitle className="font-headline text-4xl">Feature Disabled</CardTitle>
            <CardDescription>
                Password resets are not available as sign-in is managed through Google.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
              <Link href="/" className="underline text-primary font-medium">
                Return to Login
              </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
