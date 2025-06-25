"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would sign out from your auth provider
    // For this mock app, we just clear the loggedInUserId and redirect
    localStorage.removeItem('loggedInUserId');
    router.push('/');
  };

  return (
    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  );
}
