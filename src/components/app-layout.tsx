
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Book,
  Home,
  Settings,
  User,
  Info,
  Users,
  Bell,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { users } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "./logout-button";

type AppLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  const pathname = usePathname();
  const [avatar, setAvatar] = useState("");
  const [userName, setUserName] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const updateAvatarAndName = () => {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) {
            setUserName("User");
            setAvatar("");
            setIsMounted(true);
            return;
        }

        const currentUser = users.find(u => u.id === loggedInUserId);

        const savedAvatar = localStorage.getItem(`user-avatar-${loggedInUserId}`);
        const savedName = localStorage.getItem(`user-name-${loggedInUserId}`);
        
        const nameToSet = savedName || currentUser?.name || "User";
        const avatarToSet = savedAvatar || currentUser?.avatar || "https://placehold.co/100x100.png";

        setAvatar(avatarToSet);
        setUserName(nameToSet);
        setIsMounted(true);
    };

    updateAvatarAndName();

    const handleStorageChange = (event: StorageEvent) => {
        const loggedInUserId = localStorage.getItem('loggedInUserId');
        if (!loggedInUserId) return;

        if (event.key === `user-avatar-${loggedInUserId}` || event.key === `user-name-${loggedInUserId}`) {
            updateAvatarAndName();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-lg p-2">
              <Book className="size-5" />
            </div>
            <span className="font-headline text-2xl">NoteVerse</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem key="home">
              <SidebarMenuButton asChild isActive={pathname === "/home"}>
                <Link href="/home">
                  <Home />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="notes">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/semesters")}>
                <Link href="/semesters">
                  <Book />
                  Notes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem key="update">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/latest-update")}>
                <Link href="/latest-update">
                  <Bell />
                  Update
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem key="community">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/users")}>
                <Link href="/users">
                  <Users />
                  Community
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="about">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/about")}>
                <Link href="/about">
                  <Info />
                  About
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-card/50 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {isMounted ? (
                    <Avatar>
                        <AvatarImage src={avatar} alt="User" data-ai-hint="person avatar" />
                        <AvatarFallback>{(userName?.charAt(0) || 'U').toUpperCase()}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Skeleton className="h-10 w-10 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
