"use client";

import { User, Settings, FolderKanban, LogOut, BookDashedIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const getInitials = (name: string) => {
    console.log(name);
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-accent focus:ring-offset-2 focus:ring-offset-background">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-cyan-accent text-white text-xs font-semibold">
              {user ? getInitials(user?.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-foreground hidden md:block">
            {user?.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-text-secondary">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigation("/dashboard/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
          <BookDashedIcon className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("/dashboard/projects")}>
          <FolderKanban className="mr-2 h-4 w-4" />
          <span>Projects</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigation("/dashboard/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}