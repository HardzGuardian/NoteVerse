
"use client";

import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { users } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { put } from '@vercel/blob';

// In a real app, you'd get this from an auth context
const adminUserId = 'usr1'; 
const adminUser = users.find(u => u.id === adminUserId);

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(adminUser?.avatar || "https://placehold.co/128x128.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (adminUser) {
      const savedAvatar = localStorage.getItem(`user-avatar-${adminUser.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
      const savedName = localStorage.getItem(`user-name-${adminUser.id}`);
      setName(savedName || adminUser.name);
    }
    setIsMounted(true);
  }, []);

  const handleChoosePhoto = () => {
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
    if (!adminUser) return;
    setIsLoading(true);

    // Simulate saving changes
    const saveChanges = async () => {
      let changesMade = false;
      let toastDescription = "Your details have been updated.";

      // Mock password change logic
      if (newPassword) {
        if (currentPassword !== "Hardz@1998") { // Mock check for current password
          toast({ variant: "destructive", title: "Error", description: "Your current password is not correct." });
          setIsLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
          setIsLoading(false);
          return;
        }
        // In a real app, you would now update the password in the database.
        toastDescription = "Your password has been changed successfully.";
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        changesMade = true;
      }
      
      try {
        if (name !== (localStorage.getItem(`user-name-${adminUser.id}`) || adminUser.name)) {
          // Upload updated name to Vercel Blob
          await put(`users/${adminUser.id}/name.txt`, name, { access: 'public' });
          localStorage.setItem(`user-name-${adminUser.id}`, name); // Still keep in local storage for immediate feedback
          changesMade = true;
        }

        if (avatarPreview) {
          // Upload updated avatar to Vercel Blob
          const blob = await fetch(avatarPreview).then(res => res.blob());
          await put(`users/${adminUser.id}/avatar.png`, blob, { access: 'public' });
          localStorage.setItem(`user-avatar-${adminUser.id}`, avatarPreview); // Still keep in local storage for immediate feedback
          setAvatar(avatarPreview);
          setAvatarPreview(null);
          changesMade = true;
        }
      } catch (error) {
        console.error("Failed to save changes to Vercel Blob:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to save changes." });
        setIsLoading(false);
      }
      
      if (changesMade) {
        toast({
          title: "Profile Updated",
          description: toastDescription,
        });
      } else {
         toast({
          title: "No Changes",
          description: "You haven't made any changes.",
        });
      }

      setIsLoading(false);
    };
    saveChanges();
  };

  if (!isMounted) {
    return (
        <AdminLayout pageTitle="My Profile">
            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-72" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    )
  }

  return (
    <AdminLayout pageTitle="My Profile">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Admin Profile</CardTitle>
            <CardDescription>Manage your personal account details and password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarPreview || avatar} data-ai-hint="person avatar" />
                        <AvatarFallback>{(name.charAt(0) || 'A').toUpperCase()}</AvatarFallback>
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
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={adminUser?.email || ""} disabled />
                </div>
            </div>

            <Separator />
            
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} disabled={isLoading} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={isLoading} />
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
    </AdminLayout>
  );
}
