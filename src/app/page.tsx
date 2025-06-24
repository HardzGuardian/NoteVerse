
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { users as initialUsers, User } from "@/lib/data";
import { Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.9 4.54 1.74l2.42-2.42C18.14 2.09 15.61 1 12.48 1 7.03 1 3 5.03 3 10.5s4.03 9.5 9.48 9.5c2.83 0 5.1-1 6.75-2.6s2.4-4 2.4-6.6c0-.6-.05-1.2-.15-1.78Z"/></svg>
);

const DEFAULT_BG = "https://placehold.co/1920x1080.png";

function LoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState(DEFAULT_BG);
    const [overlayOpacity, setOverlayOpacity] = useState(0);

    useEffect(() => {
        const savedBg = localStorage.getItem("login-background-image");
        if (savedBg) {
            setBackgroundImage(savedBg);
        }
        const savedOpacity = localStorage.getItem("login-overlay-opacity");
        if (savedOpacity) {
            setOverlayOpacity(Number(savedOpacity));
        }
    }, []);

    const handleGoogleLogin = async () => {
        if (!auth) {
          toast({
            variant: "destructive",
            title: "Firebase Not Configured",
            description: "Please set up your Firebase credentials to enable Google Login.",
          });
          return;
        }

        setIsGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        try {
          const result = await signInWithPopup(auth, provider);
          const firebaseUser = result.user;

          const storedUsersRaw = localStorage.getItem('all-users');
          const allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;
          let appUser = allUsers.find(u => u.email === firebaseUser.email);

          if (!appUser && firebaseUser.email) {
            const newUserId = `usr${Date.now()}`;
            appUser = {
              id: newUserId,
              name: firebaseUser.displayName || "Google User",
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || 'https://placehold.co/100x100.png',
              role: 'Student',
              status: 'online',
              displayNameHidden: true,
              canChangeName: true,
            };
            allUsers.push(appUser);
            localStorage.setItem('all-users', JSON.stringify(allUsers));
            localStorage.setItem(`user-name-${newUserId}`, appUser.name);
            localStorage.setItem(`user-email-${newUserId}`, appUser.email);
            localStorage.setItem(`user-avatar-${newUserId}`, appUser.avatar);
            localStorage.setItem(`user-role-${newUserId}`, appUser.role);
            localStorage.setItem(`user-canChangeName-${newUserId}`, 'true');
          }

          if (appUser && appUser.role === 'Admin') {
            await auth.signOut();
            toast({
              variant: "destructive",
              title: "Admin Login",
              description: "Please use the admin login page.",
            });
            setIsGoogleLoading(false);
            return;
          }

          if (appUser) {
            localStorage.setItem('loggedInUserId', appUser.id);
            router.push("/home");
          }
        } catch (error: any) {
           if (error.code !== 'auth/popup-closed-by-user') {
              toast({
                variant: "destructive",
                title: "Google Login Failed",
                description: "Could not log in with Google. Please try again.",
              });
          }
        } finally {
          setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${backgroundImage}')` }} data-ai-hint="abstract background">
            <div style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} className="flex min-h-screen flex-col items-center justify-center p-4 backdrop-blur-sm">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <CardTitle className="font-headline text-4xl">NoteVerse</CardTitle>
                        <CardDescription>Welcome! Sign in to access your notes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                            className="w-full text-base py-6"
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <GoogleIcon />
                            )}
                            Continue with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>
                        <Button asChild variant="secondary" className="w-full text-base py-6">
                            <Link href="/admin/login">
                                <Shield className="mr-2 h-5 w-5" />
                                Login as Admin
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function LoginSkeleton() {
    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${DEFAULT_BG}')` }}>
             <div className="flex min-h-screen flex-col items-center justify-center p-4">
                 <Card className="w-full max-w-md shadow-2xl">
                     <CardHeader className="text-center">
                         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                         </div>
                         <CardTitle className="font-headline text-4xl">NoteVerse</CardTitle>
                         <CardDescription>Welcome! Sign in to access your notes.</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <Skeleton className="h-[52px] w-full" />
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                        </div>
                        <Skeleton className="h-[52px] w-full" />
                     </CardContent>
                 </Card>
             </div>
        </div>
    );
}

export default function LoginPage() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <LoginSkeleton />;
    }

    return <LoginForm />;
}

    