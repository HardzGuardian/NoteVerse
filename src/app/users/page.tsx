
"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Users as UsersIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showCommunityPhotos, setShowCommunityPhotos] = useState(false);

  useEffect(() => {
    const loadUsers = () => {
        const storedUsersRaw = localStorage.getItem('all-users');
        const sourceUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

        const processedUsers = sourceUsers.map(user => {
            const storedAvatar = localStorage.getItem(`user-avatar-${user.id}`);
            const storedName = localStorage.getItem(`user-name-${user.id}`);
            
            return { 
                ...user,
                name: storedName || user.name,
                avatar: storedAvatar || user.avatar,
            };
        });

        setDisplayUsers(processedUsers);
        
        const savedHideCommunityPhotos = localStorage.getItem("setting-hideCommunityPhotos");
        setShowCommunityPhotos(savedHideCommunityPhotos === 'false');
    };

    loadUsers();
    setIsMounted(true);

    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === 'all-users' || event.key?.startsWith('user-avatar-') || event.key?.startsWith('user-name-') || event.key === 'setting-hideCommunityPhotos') {
            loadUsers();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getRoleClass = (role: User['role']) => {
    switch (role) {
      case "Admin":
        return "text-destructive font-semibold";
      case "Uploader":
        return "text-accent font-semibold";
      default:
        return "text-foreground";
    }
  };

  const getDisplayName = (user: User) => {
    if (user.displayNameHidden) {
      const numericId = user.id.replace(/\D/g, "");
      return `${user.role} #${numericId.slice(-4)}`;
    }
    return user.name || user.email.split('@')[0];
  };

  const getAvatarFallback = (user: User) => {
    if (user.displayNameHidden) {
      return user.role.charAt(0);
    }
    return (user.name || user.email).charAt(0);
  };
  
  return (
    <AppLayout pageTitle="Users">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-full text-primary">
                <UsersIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="font-headline text-3xl">Community</CardTitle>
                <CardDescription>See who's part of the community.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isMounted ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                  ))
              ) : (
                displayUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="relative">
                        <Avatar className="h-12 w-12">
                        <AvatarImage src={user.displayPhotoHidden || !showCommunityPhotos ? '' : user.avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
                        </Avatar>
                        <span className={cn(
                            "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-background",
                            user.status === 'online' ? 'bg-chart-2' : 'bg-muted-foreground'
                        )} />
                    </div>
                    <div className="flex-1">
                        <p className={cn("font-medium", getRoleClass(user.role))}>{getDisplayName(user)}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                    </div>
                    </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
