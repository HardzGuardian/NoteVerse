
"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { updateNote } from "@/lib/data";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LatestUpdatePage() {
  const [noteText, setNoteText] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const updateNoteContent = () => {
      const savedNote = localStorage.getItem('update-note-text');
      const savedDate = localStorage.getItem('update-note-date');
      setNoteText(savedNote || updateNote.text);
      setLastUpdated(savedDate || updateNote.lastUpdated);
    };

    updateNoteContent();
    setIsMounted(true);

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'update-note-text' || event.key === 'update-note-date') {
            updateNoteContent();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
            {isMounted ? (
              <p>{noteText}</p>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isMounted ? (
              <p className="text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>
            ) : (
              <Skeleton className="h-4 w-40" />
            )}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}
