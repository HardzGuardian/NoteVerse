"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { aboutContent } from "@/lib/data";
import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <AppLayout pageTitle="About NoteVerse">
      <div className="flex justify-center">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full text-accent">
                <Info className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-3xl">About NoteVerse</CardTitle>
                <CardDescription>Our mission and vision for students.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-base text-card-foreground/90 leading-relaxed">
            <p>{aboutContent}</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
