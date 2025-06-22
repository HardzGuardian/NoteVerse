
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { users as initialUsers, User } from "@/lib/data";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match.",
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUserId = `usr${Date.now()}`;
      
      const newUser: User = {
        id: newUserId,
        name: username,
        email: email,
        avatar: 'https://placehold.co/100x100.png',
        role: 'Student',
        status: 'online',
        displayNameHidden: true,
        canChangeName: true,
      };

      const storedUsersRaw = localStorage.getItem('all-users');
      let allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;
      allUsers.push(newUser);
      localStorage.setItem('all-users', JSON.stringify(allUsers));
      
      localStorage.setItem('loggedInUserId', newUserId);

      localStorage.setItem(`user-name-${newUserId}`, username);
      localStorage.setItem(`user-email-${newUserId}`, email);
      localStorage.setItem(`user-avatar-${newUserId}`, newUser.avatar);
      localStorage.setItem(`user-role-${newUserId}`, 'Student');
      localStorage.setItem(`user-canChangeName-${newUserId}`, 'true');
      
      toast({
        title: "Account Created!",
        description: "Welcome to NoteVerse. You are now being logged in.",
      });
      router.push("/home");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
             <div className="mb-4 flex justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-3">
                    <BookOpen className="h-8 w-8" />
                </div>
            </div>
            <CardTitle className="font-headline text-4xl">Create Account</CardTitle>
            <CardDescription>Join NoteVerse and start organizing your studies.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="johndoe" required disabled={isLoading} value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="student@example.com" required disabled={isLoading} value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required disabled={isLoading} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline text-primary font-medium">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
