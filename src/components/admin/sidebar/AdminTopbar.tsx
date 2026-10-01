"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export function AdminTopbar({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <div className="h-14 shrink-0" aria-hidden="true" />
      <header
        className={cn(
          "fixed right-0 top-0 z-40 flex h-14 w-(--sidebar-inline-width) items-center gap-3 border-b border-gray-700 px-4 transition-[width,background-color,box-shadow] duration-200 ease-linear",
          scrolled && "bg-gray-900/60 shadow-sm backdrop-blur-sm"
        )}
      >
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="shrink-0 data-[orientation=vertical]:h-4"
        />
        <div className="min-w-0 flex-1">{children}</div>
        <div id="admin-header-actions" className="flex items-center gap-2" />
      </header>
    </>
  );
}
