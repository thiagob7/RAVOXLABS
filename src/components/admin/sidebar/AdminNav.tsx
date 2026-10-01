"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { FiExternalLink, FiGrid, FiInbox } from "react-icons/fi";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
  badge?: number;
}

const buildSections = (
  newContacts: number
): { title: string; items: NavItem[] }[] => [
  {
    title: "Portfólio",
    items: [
      { label: "Projetos", href: "/admin/projetos", icon: FiGrid },
      {
        label: "Contatos",
        href: "/admin/contatos",
        icon: FiInbox,
        badge: newContacts,
      },
    ],
  },
  {
    title: "Site",
    items: [
      { label: "Ver site", href: "/", icon: FiExternalLink, external: true },
    ],
  },
];

export function AdminNav({ newContacts }: { newContacts: number }) {
  const pathname = usePathname();
  const { open, isMobile, setOpenMobile } = useSidebar();
  const showLabel = open || isMobile;

  const isActive = (item: NavItem) =>
    !item.external && pathname.startsWith(item.href);

  return (
    <>
      {buildSections(newContacts).map((section) => (
        <SidebarGroup key={section.title}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const active = isActive(item);
                return (
                  <SidebarMenuItem key={item.href} data-active={active}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      size="lg"
                    >
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon />
                        {!showLabel && item.badge ? (
                          <span
                            aria-hidden="true"
                            className="absolute right-1 top-1 size-2 rounded-full bg-blue-500 ring-2 ring-gray-850"
                          />
                        ) : null}
                        {showLabel && <span>{item.label}</span>}
                      </Link>
                    </SidebarMenuButton>
                    {showLabel && item.badge ? (
                      <SidebarMenuBadge className="rounded-full bg-blue-500 px-1.5 text-[11px] font-semibold text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </SidebarMenuBadge>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
