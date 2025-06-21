"use client";

import Link from "next/link";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bell } from "lucide-react";
import { updateNote } from "@/lib/data";

export default function HomePage() {
  const [showBadge, setShowBadge] = useState(updateNote.isNew);

  const handleUpdateNoteClick = () => {
    setShowBadge(false);
  }

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
          <div className="bg-primary/10 p-6 sm:p-10 flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
              <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="person avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <h2 className="font-headline text-3xl font-semibold">Welcome, Student!</h2>
            <p className="text-muted-foreground mt-1">Your central hub for course materials and updates.</p>
          </div>
          <div className="p-6 grid gap-6 sm:grid-cols-2">
            <Link href="/semesters">
              <Card className="hover:shadow-md hover:border-primary transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-full text-accent">
                      <BookOpen className="h-6 w-6"/>
                    </div>
                    <CardTitle className="font-headline text-2xl">View Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Browse through semesters, subjects, and download your notes.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Card className="transition-all duration-300 h-full flex flex-col" onClick={handleUpdateNoteClick}>
               <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-full text-accent">
                            <Bell className="h-6 w-6"/>
                        </div>
                        <CardTitle className="font-headline text-2xl">Latest Update</CardTitle>
                    </div>
                    {showBadge && <Badge variant="destructive">New</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{updateNote.text}</p>
              </CardContent>
            </Card>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
