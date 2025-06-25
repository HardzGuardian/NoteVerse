
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_BG = "https://placehold.co/1920x1080.png";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [background, setBackground] = useState(DEFAULT_BG);
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  
  useEffect(() => {
    const savedBg = localStorage.getItem("login-background-image");
    if (savedBg) {
      setBackground(savedBg);
    }
    const savedOpacity = localStorage.getItem("login-overlay-opacity");
    if (savedOpacity) {
      setOverlayOpacity(Number(savedOpacity));
    }
  }, []);

  const handleLogin = () => {
    if (email === "sagarsalunkhe98@gmail.com" && password === "Hardz@1998") {
      router.push("/admin/home");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${background}')` }} data-ai-hint="abstract background">
      <div style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} className={cn("flex min-h-screen flex-col items-center justify-center p-4", overlayOpacity > 0 && "backdrop-blur-sm")}>
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                      <Shield className="h-8 w-8" />
                  </div>
              </div>
              <CardTitle className="font-headline text-4xl">Admin Panel</CardTitle>
              <CardDescription>Please log in with your admin credentials.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleLogin} className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold">
                    Login
                  </Button>
                </div>
              </div>
               <div className="mt-4 text-center text-sm">
                Not an admin?{" "}
                <Link href="/" className="underline text-primary font-medium">
                  Go to student login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminLoginSkeleton() {
    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${DEFAULT_BG}')` }}>
             <div style={{ backgroundColor: `rgba(0, 0, 0, 0.5)` }} className="flex min-h-screen flex-col items-center justify-center p-4 backdrop-blur-sm">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="mb-4 flex justify-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-3">
                                <Shield className="h-8 w-8" />
                            </div>
                        </div>
                        <CardTitle className="font-headline text-4xl">Admin Panel</CardTitle>
                        <CardDescription>Please log in with your admin credentials.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-skeleton">Email</Label>
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-skeleton">Password</Label>
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="pt-2">
                               <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Not an admin?{" "}
                            <Skeleton className="inline-block h-4 w-32" />
                        </div>
                    </CardContent>
                </Card>
             </div>
        </div>
    );
}

export default function AdminLoginPageContainer() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <AdminLoginSkeleton />;
    }

    return <AdminLoginForm />;
}
