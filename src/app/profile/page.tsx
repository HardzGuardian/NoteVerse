"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { users as initialUsers, User } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("https://placehold.co/128x128.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [canChangeName, setCanChangeName] = useState(true);
  const [canChangePhoto, setCanChangePhoto] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("loggedInUserId");
    setLoggedInUserId(userId);

    if (!userId) {
      setIsMounted(true);
      return;
    }

    const storedUsersRaw = localStorage.getItem('all-users');
    const allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;
    const currentUser = allUsers.find((u) => u.id === userId);

    const savedName = localStorage.getItem(`user-name-${userId}`);
    const savedAvatar = localStorage.getItem(`user-avatar-${userId}`);
    const savedCanChangeName = localStorage.getItem(`user-canChangeName-${userId}`);
    const savedCanChangePhoto = localStorage.getItem(`user-canChangePhoto-${userId}`);

    if (currentUser) {
        setName(savedName || currentUser.name);
        setEmail(currentUser.email);
        setAvatar(savedAvatar || currentUser.avatar);
        setCanChangeName(savedCanChangeName !== null ? JSON.parse(savedCanChangeName) : currentUser.canChangeName);
        setCanChangePhoto(savedCanChangePhoto !== null ? JSON.parse(savedCanChangePhoto) : currentUser.canChangePhoto);
    }
    
    setIsMounted(true);
  }, []);

  const handleChoosePhoto = () => {
    if (!canChangePhoto) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "An admin has disabled photo changes for your account.",
        });
        return;
    }
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!loggedInUserId) return;
    setIsLoading(true);

    let nameChanged = false;
    const currentName = localStorage.getItem(`user-name-${loggedInUserId}`) || initialUsers.find(u => u.id === loggedInUserId)?.name;
    if (name !== currentName) {
        localStorage.setItem(`user-name-${loggedInUserId}`, name);
        nameChanged = true;
    }

    let photoChanged = false;
    if (avatarPreview) {
        localStorage.setItem(`user-avatar-${loggedInUserId}`, avatarPreview);
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        photoChanged = true;
    }

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if(nameChanged || photoChanged) {
        toast({
            title: "Profile Updated",
            description: "Your profile details have been saved.",
        });
      } else {
        toast({
            title: "No Changes",
            description: "You haven't made any changes to your profile.",
        });
      }
    }, 1000);
  };
  
  if (!isMounted) {
    return (
        <AppLayout pageTitle="My Profile">
            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-48" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div className="space-y-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-10 w-full" />
                               </div>
                               <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                               </div>
                            </div>
                        </div>
                        <div>
                           <Skeleton className="h-10 w-32" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
  }

  return (
    <AppLayout pageTitle="My Profile">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
            <CardDescription>Manage your personal information. Users with Google sign-in do not need to manage passwords.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarPreview || avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{(name.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handlePhotoChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div>
                        <Button variant="outline" onClick={handleChoosePhoto} disabled={!canChangePhoto || isLoading}>Change Photo</Button>
                        {!canChangePhoto && (
                            <p className="text-xs text-muted-foreground pt-1">
                                An admin has disabled photo changes.
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!canChangeName || isLoading}
                        />
                        {!canChangeName && (
                            <p className="text-xs text-muted-foreground pt-1">
                                An admin has disabled name changes.
                            </p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={email} disabled />
                    </div>
                </div>
            </div>
            
            <div>
                <Button onClick={handleSaveChanges} disabled={isLoading} className="bg-accent hover:bg-accent/90">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
