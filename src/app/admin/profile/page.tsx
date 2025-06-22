
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

  useEffect(() => {
    if (adminUser) {
      const savedAvatar = localStorage.getItem(`user-avatar-${adminUser.id}`);
      if (savedAvatar) {
        setAvatar(savedAvatar);
      }
      const savedName = localStorage.getItem(`user-name-${adminUser.id}`);
      setName(savedName || adminUser.name);
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
    if (!adminUser) return;
    setIsLoading(true);

    // Simulate saving changes
    setTimeout(() => {
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
      
      const originalName = localStorage.getItem(`user-name-${adminUser.id}`) || adminUser.name;
      if (name !== originalName) {
        localStorage.setItem(`user-name-${adminUser.id}`, name);
        changesMade = true;
      }

      if (avatarPreview) {
        localStorage.setItem(`user-avatar-${adminUser.id}`, avatarPreview);
        setAvatar(avatarPreview);
        setAvatarPreview(null);
        changesMade = true;
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
    }, 1000);
  };

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
