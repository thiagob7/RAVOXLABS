import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "./auth";

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);

/** Garante um usuário logado; usado em páginas e Server Actions do painel. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
