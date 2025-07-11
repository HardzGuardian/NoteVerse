
"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { users as initialUsers, User } from "@/lib/data";

const fonts = [
  { name: 'Default (PT Sans)', value: 'font-body' },
  { name: 'Roboto', value: 'font-roboto' },
  { name: 'Lato', value: 'font-lato' },
  { name: 'Open Sans', value: 'font-open-sans' },
  { name: 'Merriweather', value: 'font-merriweather' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [font, setFont] = useState('font-body');
  const [hideProfile, setHideProfile] = useState(true);
  const [hideCommunityPhotos, setHideCommunityPhotos] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const savedFont = localStorage.getItem("font") || "font-body";
    setFont(savedFont);

    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        const storedUsersRaw = localStorage.getItem('all-users');
        const allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;
        const currentUser = allUsers.find(u => u.id === loggedInUserId);
        if (currentUser) {
            setHideProfile(currentUser.displayNameHidden);
        }
    }

    const savedHideCommunityPhotos = localStorage.getItem("setting-hideCommunityPhotos");
    setHideCommunityPhotos(savedHideCommunityPhotos !== 'false');

    setMounted(true);
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (mounted) {
      fonts.forEach(f => document.body.classList.remove(f.value));
      if (font !== 'font-body') {
        document.body.classList.add(font);
      }
      localStorage.setItem("font", font);
    }
  }, [font, mounted]);
  
  useEffect(() => {
    if (mounted && !initialLoad) {
      const loggedInUserId = localStorage.getItem('loggedInUserId');
      if (loggedInUserId) {
        const storedUsersRaw = localStorage.getItem('all-users');
        let allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;
        allUsers = allUsers.map(user => 
            user.id === loggedInUserId ? { ...user, displayNameHidden: hideProfile, displayPhotoHidden: hideProfile } : user
        );
        localStorage.setItem('all-users', JSON.stringify(allUsers));
      }

      toast({
          title: "Privacy Setting Updated",
          description: `Your name and photo are now ${hideProfile ? 'hidden from' : 'visible to'} other users.`,
      })
    }
  }, [hideProfile, mounted, initialLoad, toast]);
  
  useEffect(() => {
    if (mounted && !initialLoad) {
      localStorage.setItem("setting-hideCommunityPhotos", String(hideCommunityPhotos));
      toast({
          title: "Community Privacy Updated",
          description: `Other users' photos are now ${hideCommunityPhotos ? 'hidden' : 'visible'}.`,
      })
    }
  }, [hideCommunityPhotos, mounted, initialLoad, toast]);


  return (
    <AppLayout pageTitle="Settings">
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Settings</CardTitle>
            <CardDescription>Manage your application preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="theme" className="text-base font-medium">Appearance</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
                </div>
                <ThemeToggle />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="font-select" className="text-base font-medium">Font Style</Label>
                    <p className="text-sm text-muted-foreground">Change the application's font.</p>
                </div>
                 {mounted ? (
                    <Select value={font} onValueChange={setFont}>
                        <SelectTrigger id="font-select" className="w-[180px]">
                            <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fonts.map(f => (
                                <SelectItem key={f.value} value={f.value}>{f.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <div className="w-[180px] h-10 bg-muted rounded-md animate-pulse" />
                )}
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="privacy-switch" className="text-base font-medium">My Privacy</Label>
                    <p className="text-sm text-muted-foreground">Hide my name & photo in the Community tab.</p>
                </div>
                 {mounted ? (
                    <Switch
                        id="privacy-switch"
                        checked={hideProfile}
                        onCheckedChange={setHideProfile}
                        aria-label="Toggle profile visibility"
                    />
                ) : (
                    <div className="w-11 h-6 bg-muted rounded-full animate-pulse" />
                )}
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label htmlFor="community-photo-switch" className="text-base font-medium">Hide Community Photos</Label>
                    <p className="text-sm text-muted-foreground">Hide profile pictures of other users in the Community tab.</p>
                </div>
                 {mounted ? (
                    <Switch
                        id="community-photo-switch"
                        checked={hideCommunityPhotos}
                        onCheckedChange={setHideCommunityPhotos}
                        aria-label="Toggle visibility of other users' photos"
                    />
                ) : (
                    <div className="w-11 h-6 bg-muted rounded-full animate-pulse" />
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
