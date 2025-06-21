"use client";

import Link from "next/link";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Bell } from "lucide-react";
import { updateNote } from "@/lib/data";

export default function HomePage() {
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
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
            <p className="text-muted-foreground mt-1">Role: {userRole}</p>
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
            
            <Card className={`${userRole === 'admin' ? 'hover:shadow-md hover:border-primary' : ''} transition-all duration-300 h-full flex flex-col`} onClick={handleUpdateNoteClick}>
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
              {userRole === 'admin' && (
                <div className="p-6 pt-0">
                    <Button asChild className="w-full bg-accent hover:bg-accent/90">
                        <Link href="/update-note"><Edit className="mr-2 h-4 w-4" /> Edit Note</Link>
                    </Button>
                </div>
              )}
            </Card>
          </div>
        </Card>
        
        <Card className="mt-6 w-full max-w-4xl shadow-lg">
            <CardHeader>
                <CardTitle>Developer Controls</CardTitle>
                <CardDescription>Toggle user role for demonstration purposes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="role-switch">User</Label>
                    <Switch
                        id="role-switch"
                        checked={userRole === 'admin'}
                        onCheckedChange={(checked) => setUserRole(checked ? 'admin' : 'user')}
                    />
                    <Label htmlFor="role-switch">Admin</Label>
                </div>
            </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
