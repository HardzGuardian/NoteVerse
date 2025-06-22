
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }} data-ai-hint="abstract background">
      <div className="flex min-h-screen flex-col items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
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
