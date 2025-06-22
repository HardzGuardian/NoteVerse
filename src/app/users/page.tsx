
"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users as initialUsers, User } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Users as UsersIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // This simulates the identity of the currently logged-in user.
  // In a real app, this would come from an authentication context.
  const loggedInUserId = 'usr2';

  useEffect(() => {
    // This effect runs only on the client to check the user's preference and avatar.
    const hideNamePreference = localStorage.getItem('user-hide-name');
    const shouldHideName = hideNamePreference ? JSON.parse(hideNamePreference) : true;

    const processedUsers = initialUsers.map(user => {
      const storedAvatar = localStorage.getItem(`user-avatar-${user.id}`);
      let userIsHidden = user.displayNameHidden;

      // If this user is the one currently logged in, respect their privacy setting.
      if (user.id === loggedInUserId) {
        userIsHidden = shouldHideName;
      }
      
      return { 
        ...user, 
        displayNameHidden: userIsHidden,
        avatar: storedAvatar || user.avatar, // Override avatar if it exists in local storage
      };
    });

    setDisplayUsers(processedUsers);
    setIsLoading(false);
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
      return `${user.role} #${user.id.replace(/\D/g, "")}`;
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
                <CardDescription>See who's currently online.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
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
                        <AvatarImage src={user.displayNameHidden ? '' : user.avatar} data-ai-hint="person avatar" />
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
