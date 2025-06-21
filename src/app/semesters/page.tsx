"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { semesters as allSemesters } from "@/lib/data";
import { PlusCircle, Book, RefreshCw } from "lucide-react";

// Assuming role is managed globally, for now we hardcode it.
const USER_ROLE = "admin";

export default function SemestersPage() {
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout pageTitle="Semesters">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Semesters</h2>
          <p className="text-muted-foreground">Select a semester to view subjects.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={refreshData}><RefreshCw className="mr-2 h-4 w-4"/> Refresh</Button>
            {USER_ROLE === "admin" && (
            <Button className="bg-accent hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
            </Button>
            )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          : allSemesters.map((semester) => (
              <Link href={`/semesters/${semester.id}`} key={semester.id}>
                <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <Book className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-2xl">{semester.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {semester.subjects.length} {semester.subjects.length === 1 ? "subject" : "subjects"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
    </AppLayout>
  );
}
