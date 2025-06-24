
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Semester } from "@/lib/data";
import { Book, RefreshCw } from "lucide-react";

export default function SemestersPage() {
  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const loadData = () => {
    setLoading(true);
    const savedSemesters = localStorage.getItem('semesters');
    setSemesters(savedSemesters ? JSON.parse(savedSemesters) : []);
    setTimeout(() => setLoading(false), 1000);
  }

  useEffect(() => {
    loadData();
    
    // Listen for changes from other tabs
    window.addEventListener('storage', (e) => {
        if(e.key === 'semesters') {
            loadData();
        }
    });

  }, []);

  return (
    <AppLayout pageTitle="Semesters">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Semesters</h2>
          <p className="text-muted-foreground">Select a semester to view its subjects, notes, and exam papers.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={loadData}><RefreshCw className="mr-2 h-4 w-4"/> Refresh</Button>
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
          : semesters.map((semester) => (
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

    