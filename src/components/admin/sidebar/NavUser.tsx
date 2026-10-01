"use client";

import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

export interface NavUserProps {
  user: { name: string; email: string };
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

function UserBlock({ user }: NavUserProps) {
  return (
    <>
      <Avatar className="h-8 w-8 rounded-full bg-blue-500/15">
        <AvatarFallback className="rounded-full bg-transparent text-xs font-semibold text-blue-500">
          {initialsOf(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium text-white">{user.name}</span>
        <span className="truncate text-xs text-gray-300">{user.email}</span>
      </div>
    </>
  );
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const { open, isMobile } = useSidebar();

  async function signOut() {
    await authClient.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-gray-700 group-data-[collapsible=icon]:p-0!"
            >
              {open || isMobile ? (
                <>
                  <UserBlock user={user} />
                  <ChevronsUpDown className="ml-auto" />
                </>
              ) : (
                <Avatar className="h-8 w-8 rounded-full bg-blue-500/15">
                  <AvatarFallback className="rounded-full bg-transparent text-xs font-semibold text-blue-500">
                    {initialsOf(user.name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <UserBlock user={user} />
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Ver site
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={signOut}
              className="text-red-400 focus:text-red-400"
            >
              <LogOut className="text-red-400" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
