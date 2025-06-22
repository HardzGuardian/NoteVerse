
"use client";

import { useState, useRef, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/data"; // Mock data

// In a real app, you'd get this from an auth context
const loggedInUserId = 'usr2'; 
const currentUser = users.find(u => u.id === loggedInUserId);

export default function ProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState(currentUser ? (currentUser.name || currentUser.email.split('@')[0]) : "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "https://placehold.co/128x128.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const canChangeName = currentUser?.canChangeName ?? false;

  useEffect(() => {
    if (currentUser) {
      const savedAvatar = localStorage.getItem(`user-avatar-${currentUser.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
    }
  }, []);

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!currentUser) return;
    setIsLoading(true);
    // In a real app, you would save this to a database
    setTimeout(() => {
      let photoUpdated = false;
      if (avatarPreview && avatarFile) {
        // Here you would upload the avatarFile to your storage and get a URL
        // For now, we'll just update the local state to simulate it.
        localStorage.setItem(`user-avatar-${currentUser.id}`, avatarPreview);
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        setAvatarFile(null);
        photoUpdated = true;
        // Dispatch event to notify other components of avatar change
        window.dispatchEvent(new Event('avatar-updated'));
      }

      console.log("Saving new name:", name);
      // Here you would update the user data source
      
      toast({
        title: "Profile Updated",
        description: `Your ${photoUpdated ? "photo and " : ""}name has been successfully updated.`,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AppLayout pageTitle="My Profile">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
            <CardDescription>View and edit your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Button variant="outline" onClick={handleChoosePhoto}>Change Photo</Button>
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
                            Your name has been locked by an administrator.
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={currentUser?.email || ""} disabled />
                </div>
            </div>
            <div>
                <Button onClick={handleSaveChanges} disabled={isLoading} className="bg-accent hover:bg-accent/90">
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
