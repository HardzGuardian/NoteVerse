
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bell } from "lucide-react";
import { updateNote, users } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [showBadge, setShowBadge] = useState(updateNote.isNew);
  const [userName, setUserName] = useState("Student");
  const [avatar, setAvatar] = useState("https://placehold.co/128x128.png");
  const [avatarFallback, setAvatarFallback] = useState("S");
  const [noteText, setNoteText] = useState(updateNote.text);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) {
      setIsMounted(true);
      return;
    };

    const currentUser = users.find(u => u.id === loggedInUserId);

    const updateUserData = () => {
      const savedAvatar = localStorage.getItem(`user-avatar-${loggedInUserId}`);
      const savedName = localStorage.getItem(`user-name-${loggedInUserId}`);
      
      const name = savedName || currentUser?.name || "Student";
      const avatarUrl = savedAvatar || currentUser?.avatar || "https://placehold.co/128x128.png";
      
      setAvatar(avatarUrl);
      setUserName(name);
      setAvatarFallback(name.charAt(0).toUpperCase());
    };
    
    const updateNoteData = () => {
        const savedNote = localStorage.getItem('update-note-text');
        setNoteText(savedNote || updateNote.text);
    }

    updateUserData();
    updateNoteData();
    setIsMounted(true);
    
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === `user-name-${loggedInUserId}` || event.key === `user-avatar-${loggedInUserId}`) {
            updateUserData();
        }
        if (event.key === 'update-note-text') {
            updateNoteData();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AppLayout pageTitle="Dashboard">
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
          <div className="bg-primary/10 p-6 sm:p-10 flex flex-col items-center text-center">
            {isMounted ? (
              <>
                <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
                  <AvatarImage src={avatar} data-ai-hint="person avatar" />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <h2 className="font-headline text-3xl font-semibold">Welcome, {userName}!</h2>
              </>
            ) : (
              <>
                <Skeleton className="w-24 h-24 rounded-full mb-4" />
                <Skeleton className="h-8 w-48" />
              </>
            )}
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
            
            <Link href="/latest-update">
                <Card className="hover:shadow-md hover:border-primary transition-all duration-300 h-full flex flex-col">
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
                    {isMounted ? (
                      <p className="text-muted-foreground line-clamp-3">{noteText}</p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
