
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
  LogOut,
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/admin" || pathname === "/admin/home"}>
                <Link href="/admin">
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/semesters")}>
                <Link href="/admin/semesters">
                  <BookCopy />
                  Manage Notes
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/users")}>
                <Link href="/admin/users">
                  <Users />
                  User Management
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/admin/users/add"}>
                <Link href="/admin/users/add">
                  <User />
                  Add User
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/update-note")}>
                <Link href="/admin/update-note">
                  <Megaphone />
                  Manage Update
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/admin/about")}>
                <Link href="/admin/about">
                  <FileText />
                  Manage About
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
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
                <Avatar>
                  <AvatarImage src={adminAvatar} alt="Admin User" data-ai-hint="person avatar" />
                  <AvatarFallback>{adminFallback}</AvatarFallback>
                </Avatar>
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
              <DropdownMenuItem asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
