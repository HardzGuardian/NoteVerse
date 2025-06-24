
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { users as initialUsers, User } from "@/lib/data";
import { Loader2, Shield } from "lucide-react";

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.63 1.9-3.87 0-7-3.13-7-7s3.13-7 7-7c2.25 0 3.67.9 4.54 1.74l2.42-2.42C18.14 2.09 15.61 1 12.48 1 7.03 1 3 5.03 3 10.5s4.03 9.5 9.48 9.5c2.83 0 5.1-1 6.75-2.6s2.4-4 2.4-6.6c0-.6-.05-1.2-.15-1.78Z"/></svg>
);


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEmailLoading(true);

    // This is a mock login. In a real app, you'd validate against a database.
    const storedUsersRaw = localStorage.getItem('all-users');
    const allUsers: User[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : initialUsers;

    const user = allUsers.find(u => u.email === email);
    const storedPassword = user ? localStorage.getItem(`user-password-${user.id}`) : null;

    setTimeout(() => {
        if (user && user.role !== 'Admin' && storedPassword && password === storedPassword) {
            localStorage.setItem('loggedInUserId', user.id);
            router.push("/home");
        } else {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password.",
            });
        }
        setIsEmailLoading(false);
    }, 1000);
  };

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
        // Create a new user if they don't exist
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
        
        // Store individual user details for consistency
        localStorage.setItem(`user-name-${newUserId}`, appUser.name);
        localStorage.setItem(`user-email-${newUserId}`, appUser.email);
        localStorage.setItem(`user-avatar-${newUserId}`, appUser.avatar);
        localStorage.setItem(`user-role-${newUserId}`, appUser.role);
        localStorage.setItem(`user-canChangeName-${newUserId}`, 'true');
        // Note: We don't set a password for Google-authenticated users
      }
      
      if (appUser) {
        localStorage.setItem('loggedInUserId', appUser.id);
        router.push("/home");
      }
    } catch (error: any) {
      console.error("Google login error:", error);
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
                <Button variant="outline" type="button" onClick={handleGoogleLogin} disabled={isGoogleLoading || isEmailLoading}>
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  Login with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isGoogleLoading || isEmailLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isGoogleLoading || isEmailLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isGoogleLoading || isEmailLoading}>
                 {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
          <div className="text-center text-sm">
            <Button asChild variant="link" className="p-0 h-auto">
                <Link href="/admin/login">
                    <Shield className="mr-2 h-4 w-4" />
                    Login as Admin
                </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:flex flex-col items-center justify-center p-10 text-center">
        <div className="relative">
            <Image
                src="https://placehold.co/800x600.png"
                alt="Image"
                width="800"
                height="600"
                className="rounded-lg shadow-2xl"
                data-ai-hint="digital abstract"
            />
        </div>
        <h1 className="font-headline text-4xl font-bold mt-8">NoteVerse</h1>
        <p className="text-muted-foreground mt-2 max-w-sm">
            Your all-in-one solution for organized notes and seamless collaboration.
        </p>
      </div>
    </div>
  )
}
