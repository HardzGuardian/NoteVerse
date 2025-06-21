"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { semesters as allSemesters } from "@/lib/data";
import { PlusCircle, FileText, ChevronRight, FolderOpen } from "lucide-react";

// Assuming role is managed globally, for now we hardcode it.
const USER_ROLE = "admin";

export default function SubjectsPage({ params }: { params: { semesterId: string } }) {
  const [loading, setLoading] = useState(true);
  const semester = allSemesters.find((s) => s.id === params.semesterId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!semester && !loading) {
    return (
      <AppLayout pageTitle="Error">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Semester not found</h2>
          <p className="text-muted-foreground">The requested semester does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/semesters">Go Back</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle={semester?.name || "Loading..."}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
          <p className="text-muted-foreground">Select a subject to view notes.</p>
        </div>
        {USER_ROLE === "admin" && (
          <Button className="bg-accent hover:bg-accent/90">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : semester && semester.subjects.length > 0 ? (
        <div className="space-y-4">
          {semester.subjects.map((subject) => (
            <Link href={`/semesters/${semester.id}/subjects/${subject.id}`} key={subject.id}>
              <Card className="hover:shadow-md hover:border-primary transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <FileText className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {subject.pdfs.length} {subject.pdfs.length === 1 ? "PDF" : "PDFs"}
                            </p>
                        </div>
                    </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardHeader>
                <div className="mx-auto bg-secondary p-4 rounded-full">
                    <FolderOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">No Subjects Yet</CardTitle>
                <CardDescription>The admin hasn't added any subjects for this semester.</CardDescription>
            </CardHeader>
            <CardContent>
                {USER_ROLE === "admin" && (
                    <Button className="bg-accent hover:bg-accent/90">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add First Subject
                    </Button>
                )}
            </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}
