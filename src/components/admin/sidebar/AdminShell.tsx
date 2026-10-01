"use client";

import type { ReactNode } from "react";
import { Bounce, ToastContainer } from "react-toastify";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "../ui/sidebar";
import { AdminBreadcrumbs } from "./AdminBreadcrumbs";
import { AdminNav } from "./AdminNav";
import { AdminTopbar } from "./AdminTopbar";
import { NavLogo } from "./NavLogo";
import { NavUser, type NavUserProps } from "./NavUser";

interface AdminShellProps {
  user: NavUserProps["user"];
  defaultOpen: boolean;
  newContacts: number;
  children: ReactNode;
}

export function AdminShell({
  user,
  defaultOpen,
  newContacts,
  children,
}: AdminShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <NavLogo />
        </SidebarHeader>
        <SidebarContent>
          <AdminNav newContacts={newContacts} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <AdminTopbar>
          <AdminBreadcrumbs />
        </AdminTopbar>
        <div className="flex min-h-[70vh] min-w-0 flex-1 justify-center overflow-x-hidden p-4 pt-0 md:px-6">
          <div className="flex w-full max-w-[1200px] flex-col gap-6 pt-6">
            {children}
          </div>
        </div>
      </SidebarInset>

      <ToastContainer
        position="top-right"
        autoClose={4000}
        theme="dark"
        transition={Bounce}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
      />
    </SidebarProvider>
  );
}
