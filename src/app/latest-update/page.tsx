
"use client";

import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { updateNote } from "@/lib/data";
import { Bell } from "lucide-react";

export default function LatestUpdatePage() {
  return (
    <AppLayout pageTitle="Latest Update">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full text-accent">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-3xl">Latest Update</CardTitle>
                <CardDescription>The most recent announcement for students.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-base text-card-foreground/90 leading-relaxed">
            <p>{updateNote.text}</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Last Updated: {updateNote.lastUpdated}</p>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
