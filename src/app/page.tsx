
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.9 4.54 1.74l2.42-2.42C18.14 2.09 15.61 1 12.48 1 7.03 1 3 5.03 3 10.5s4.03 9.5 9.48 9.5c2.83 0 5.1-1 6.75-2.6s2.4-4 2.4-6.6c0-.6-.05-1.2-.15-1.78Z"/></svg>
);

const DEFAULT_BG = "https://placehold.co/1920x1080.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
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
    // This is a mock login. In a real app, you'd validate against a database.
    // For demonstration, we'll treat any other credentials as invalid.
    if (email === "student@example.com" && password === "password") {
      router.push("/home");
    } else {
      setLoginAttempts((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  const handleGoogleLogin = () => {
      router.push("/home");
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${background}')` }} data-ai-hint="abstract background">
      <div style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} className="flex min-h-screen flex-col items-center justify-center p-4 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-3">
                      <BookOpen className="h-8 w-8" />
                  </div>
              </div>
              <CardTitle className="font-headline text-4xl">NoteVerse</CardTitle>
              <CardDescription>Welcome back! Please log in to continue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <GoogleIcon />
                    Login with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="student@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {loginAttempts >= 2 && (
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline text-primary font-medium"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                    Login as Student
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/admin/login">
                      <Shield className="mr-2 h-4 w-4" />
                      Login as Admin
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline text-primary font-medium">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
