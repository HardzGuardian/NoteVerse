
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
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("https://placehold.co/128x128.png");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [canChangeName, setCanChangeName] = useState(true);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) return;

    const currentUser = users.find(u => u.id === loggedInUserId);

    const savedAvatar = localStorage.getItem(`user-avatar-${loggedInUserId}`);
    const savedName = localStorage.getItem(`user-name-${loggedInUserId}`);
    const savedEmail = localStorage.getItem(`user-email-${loggedInUserId}`);
    const savedCanChangeName = localStorage.getItem(`user-canChangeName-${loggedInUserId}`);

    setAvatar(savedAvatar || currentUser?.avatar || "https://placehold.co/128x128.png");
    setName(savedName || currentUser?.name || "User");
    setEmail(savedEmail || currentUser?.email || "");

    if (savedCanChangeName !== null) {
      setCanChangeName(JSON.parse(savedCanChangeName));
    } else if (currentUser) {
      setCanChangeName(currentUser.canChangeName);
    }
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
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (!loggedInUserId) return;
    setIsLoading(true);

    setTimeout(() => {
      let photoUpdated = false;
      let nameUpdated = false;
      let passwordUpdated = false;

      // Password change logic
      if (newPassword) {
        if (currentPassword !== "password") { // Mock password check
          toast({ variant: "destructive", title: "Error", description: "Your current password is not correct." });
          setIsLoading(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          toast({ variant: "destructive", title: "Error", description: "New passwords do not match." });
          setIsLoading(false);
          return;
        }
        // In a real app, update password in DB
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        passwordUpdated = true;
      }
      
      const originalName = localStorage.getItem(`user-name-${loggedInUserId}`) || "";
      if (name !== originalName) {
        localStorage.setItem(`user-name-${loggedInUserId}`, name);
        nameUpdated = true;
      }

      if (avatarPreview) {
        localStorage.setItem(`user-avatar-${loggedInUserId}`, avatarPreview);
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        photoUpdated = true;
      }
      
      const changes = [
        passwordUpdated ? "password" : null,
        nameUpdated ? "name" : null,
        photoUpdated ? "photo" : null,
      ].filter(Boolean) as string[];

      if (changes.length > 0) {
        window.dispatchEvent(new Event('avatar-updated'));
        
        let description = "Your " + changes.join(', ').replace(/, ([^,]*)$/, ' and $1') + ` has${changes.length > 1 ? 've' : ''} been updated.`;

        toast({
          title: "Profile Updated",
          description: description,
        });
      } else {
         toast({
          title: "No Changes",
          description: "You haven't made any changes to your profile.",
        });
      }

      setIsLoading(false);
    }, 1000);
  };

  return (
    <AppLayout pageTitle="My Profile">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">My Profile</CardTitle>
            <CardDescription>Manage your personal information and password.</CardDescription>
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
                        <Input id="email" type="email" value={email} disabled />
                    </div>
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
    </AppLayout>
  );
}
