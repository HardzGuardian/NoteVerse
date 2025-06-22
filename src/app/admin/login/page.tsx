
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const DEFAULT_BG = "https://placehold.co/1920x1080.png";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();
  const { toast } = useToast();
  const [background, setBackground] = useState(DEFAULT_BG);
  const [overlayOpacity, setOverlayOpacity] = useState(50);

  useEffect(() => {
    // This effect runs on the client to safely access localStorage.
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
    if (email === "sagarsalunkhe98@gmail.com" && password === "Hardz@1998") {
      router.push("/admin");
    } else {
      setLoginAttempts((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('${background}')` }} data-ai-hint="abstract background">
      <div style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})` }} className="flex min-h-screen flex-col items-center justify-center p-4 backdrop-blur-sm">
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {loginAttempts >= 2 && (
                      <Link
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline text-primary font-medium"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleLogin} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
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
