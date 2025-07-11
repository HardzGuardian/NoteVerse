
"use client";

import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCopy, FileText, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import { users } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";

const adminUserId = 'usr1';

export default function AdminHomePage() {
  const [adminName, setAdminName] = useState("Admin");
  const [adminAvatar, setAdminAvatar] = useState("https://placehold.co/128x128.png");
  const [adminFallback, setAdminFallback] = useState("A");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const adminUser = users.find(u => u.id === adminUserId);
    if (!adminUser) {
      setIsMounted(true);
      return;
    }
    
    const updateAdminData = () => {
        const savedName = localStorage.getItem(`user-name-${adminUserId}`);
        const savedAvatar = localStorage.getItem(`user-avatar-${adminUserId}`);

        const name = savedName || adminUser.name;
        
        setAdminName(name);
        setAdminAvatar(savedAvatar || adminUser.avatar);
        setAdminFallback(name.charAt(0).toUpperCase());
    };

    updateAdminData();
    setIsMounted(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `user-name-${adminUserId}` || event.key === `user-avatar-${adminUserId}`) {
        updateAdminData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AdminLayout pageTitle="Admin Dashboard">
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-4xl overflow-hidden shadow-lg">
          <div className="bg-primary/10 p-6 sm:p-10 flex flex-col items-center text-center">
            {isMounted ? (
                <>
                    <Avatar className="w-24 h-24 border-4 border-background shadow-md mb-4">
                        <AvatarImage src={adminAvatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{adminFallback}</AvatarFallback>
                    </Avatar>
                    <h2 className="font-headline text-3xl font-semibold">Welcome, {adminName}!</h2>
                </>
            ) : (
                <>
                    <Skeleton className="w-24 h-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-48" />
                </>
            )}
            <p className="text-muted-foreground mt-1">Administrator Control Panel</p>
          </div>
          <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/semesters">
              <Card className="hover:shadow-md hover:border-primary transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-full text-accent">
                      <BookCopy className="h-6 w-6"/>
                    </div>
                    <CardTitle className="font-headline text-xl">Manage Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Add/edit semesters, subjects, notes, and exams.</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/admin/update-note">
              <Card className="hover:shadow-md hover:border-primary transition-all duration-300 h-full flex flex-col">
                 <CardHeader>
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-full text-accent">
                          <Megaphone className="h-6 w-6"/>
                      </div>
                      <CardTitle className="font-headline text-xl">Manage Update</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Edit the announcement on the user dashboard.</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/about">
              <Card className="hover:shadow-md hover:border-primary transition-all duration-300 h-full flex flex-col">
                 <CardHeader>
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-full text-accent">
                          <FileText className="h-6 w-6"/>
                      </div>
                      <CardTitle className="font-headline text-xl">Manage About Page</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Edit the content of the public "About Us" page.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
