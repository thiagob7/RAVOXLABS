"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

function crumbsFor(pathname: string) {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Painel", href: "/admin/projetos" },
  ];

  if (pathname.startsWith("/admin/projetos")) {
    crumbs.push({ label: "Projetos" });
  } else if (pathname.startsWith("/admin/contatos")) {
    crumbs.push({ label: "Contatos" });
  }

  return crumbs;
}

export function AdminBreadcrumbs() {
  const crumbs = crumbsFor(usePathname());

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap text-sm text-gray-300">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 && (
              <BreadcrumbSeparator
                className={index === 1 ? "max-md:hidden" : undefined}
              />
            )}
            <BreadcrumbItem
              className={index === 0 ? "max-md:hidden" : undefined}
            >
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-white">
                  {crumb.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
