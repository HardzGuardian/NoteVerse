
"use client";

import { useState } from "react";
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
  const [name, setName] = useState(currentUser?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  
  const canChangeName = currentUser?.canChangeName ?? false;

  const handleSaveChanges = () => {
    setIsLoading(true);
    // In a real app, you would save this to a database
    setTimeout(() => {
      console.log("Saving new name:", name);
      // Here you would update the user data source
      toast({
        title: "Profile Updated",
        description: "Your name has been successfully updated.",
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
                <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="person avatar" />
                <AvatarFallback>{name.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
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
                <Button onClick={handleSaveChanges} disabled={!canChangeName || isLoading} className="bg-accent hover:bg-accent/90">
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
