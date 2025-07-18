
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Book,
  Settings,
  LayoutDashboard,
  BookCopy,
  FileText,
  Megaphone,
  Users,
  User,
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

type AdminLayoutProps = {
  children: React.ReactNode;
  pageTitle: string;
};

// In a real app, you'd get this from an auth context
const adminUserId = 'usr1';

export function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
  const pathname = usePathname();
  const [adminAvatar, setAdminAvatar] = useState("");
  const [adminFallback, setAdminFallback] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const updateAdminDetails = () => {
        const adminUser = users.find(u => u.id === adminUserId);
        if (!adminUser) return;
        
        const savedAvatar = localStorage.getItem(`user-avatar-${adminUserId}`);
        const savedName = localStorage.getItem(`user-name-${adminUserId}`);
        
        const name = savedName || adminUser.name;
        setAdminAvatar(savedAvatar || adminUser.avatar);
        setAdminFallback(name.charAt(0).toUpperCase());
    };

    updateAdminDetails();
    setIsMounted(true);

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `user-avatar-${adminUserId}` || event.key === `user-name-${adminUserId}`) {
        updateAdminDetails();
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
            <div>
                <span className="font-headline text-2xl">NoteVerse</span>
                <div className="text-xs font-semibold uppercase text-primary">Admin</div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem key="dashboard">
              <SidebarMenuButton asChild isActive={pathname === "/admin" || pathname === "/admin/home"}>
                <Link href="/admin/home">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="notes">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/semesters")}>
                <Link href="/admin/semesters">
                  <BookCopy />
                  Manage Notes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="users">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/users")}>
                <Link href="/admin/users">
                  <Users />
                  User Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="update">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/update-note")}>
                <Link href="/admin/update-note">
                  <Megaphone />
                  Manage Update
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem key="about">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/about")}>
                <Link href="/admin/about">
                  <FileText />
                  Manage About
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem key="settings">
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/settings")}>
                <Link href="/admin/settings">
                  <Settings />
                  Settings
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
                        <AvatarImage src={adminAvatar} alt="Admin User" data-ai-hint="person avatar" />
                        <AvatarFallback>{adminFallback}</AvatarFallback>
                    </Avatar>
                ) : (
                    <Skeleton className="h-10 w-10 rounded-full" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">
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
