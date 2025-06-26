
"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/data";
import { Loader2 } from "lucide-react";
import { get } from "@vercel/blob";
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

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (!loggedInUserId) {
      setIsMounted(true);
      return;
    }

    const fetchUserData = async () => {
      try {
        const blob = await get(`users/${loggedInUserId}/profile.json`, {
          cacheControlMaxAge: 0,
        });
        const userData = await blob.json();

        setName(userData.name || "User");
        setAvatar(userData.avatar || "https://placehold.co/128x128.png");
        setEmail(userData.email || "");
    const savedCanChangeName = localStorage.getItem(`user-canChangeName-${loggedInUserId}`);
    const savedCanChangePhoto = localStorage.getItem(`user-canChangePhoto-${loggedInUserId}`);

    setAvatar(savedAvatar || currentUser?.avatar || "https://placehold.co/128x128.png");
    setName(savedName || currentUser?.name || "User");
    setEmail(savedEmail || currentUser?.email || "");

    if (savedCanChangeName !== null) {
      setCanChangeName(JSON.parse(savedCanChangeName));
    } else if (currentUser) {
      setCanChangeName(currentUser.canChangeName);
    }
    
    if (savedCanChangePhoto !== null) {
      setCanChangePhoto(JSON.parse(savedCanChangePhoto));
    } else if (currentUser) {
      setCanChangePhoto(currentUser.canChangePhoto);
    }

        // If user data is not in blob storage, fallback to local storage or default data
        if (!userData) {
          const currentUser = users.find((u) => u.id === loggedInUserId);
          setName(currentUser?.name || "User");
          setAvatar(currentUser?.avatar || "https://placehold.co/128x128.png");
          setEmail(currentUser?.email || "");
        }
      } catch (error) {
        console.error("Error fetching user data from Vercel Blob:", error);
      } finally {
        setIsMounted(true);
      }
    };

    fetchUserData();
  }, []);
  const handleChoosePhoto = () => {
    if (!canChangePhoto) {
        toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "An admin has disabled photo changes.",
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

  const handleSaveChanges = async () => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (!loggedInUserId) return;
    setIsLoading(true);

    try {
      let photoUpdated = false;
      let nameUpdated = false;

      const originalName = (await get(`users/${loggedInUserId}/profile.json`).then(blob => blob.json()).catch(() => ({}))).name || "";
      if (name !== originalName) {
        nameUpdated = true;
      }

      if (avatarPreview) {
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        photoUpdated = true;
      }

      const changes = [
        nameUpdated ? "name" : null,
        photoUpdated ? "photo" : null,
      ].filter(Boolean) as string[];

      if (changes.length > 0) {
        const userData = { name, avatar: avatarPreview || avatar, email };
        await put(`users/${loggedInUserId}/profile.json`, JSON.stringify(userData), {
          access: "public",
          contentType: "application/json",
        });


      if (changes.length > 0) {
        let description = "Your " + changes.join(', ').replace(/, ([^,]*)$/, ' and $1') + ` has${changes.length > 1 ? 've' : ''} been updated.`;
        toast({
          title: "Profile Updated",
          description: description,
        });
      }
      setIsLoading(false);
    }
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
