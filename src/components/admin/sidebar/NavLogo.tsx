"use client";

import Image from "next/image";
import Link from "next/link";

import { useSidebar } from "../ui/sidebar";

export function NavLogo() {
  const { open, isMobile } = useSidebar();
  const expanded = open || isMobile;

  return (
    <Link
      href="/admin/projetos"
      className="flex h-10 items-center gap-2 px-1"
      aria-label="Painel RAVOX Labs"
    >
      {expanded ? (
        <>
          <Image
            src="/assets/img/Logo.png"
            alt="RAVOX Labs"
            width={120}
            height={36}
            className="h-auto w-[104px]"
          />
          <span className="rounded-md border border-gray-700 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-300">
            Painel
          </span>
        </>
      ) : (
        <Image
          src="/assets/img/MiniLogo.png"
          alt="RAVOX Labs"
          width={32}
          height={32}
          className="size-6 object-contain"
        />
      )}
    </Link>
  );
}
