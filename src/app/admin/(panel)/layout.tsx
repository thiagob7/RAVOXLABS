import { cookies } from "next/headers";

import { AdminShell } from "@/components/admin/sidebar/AdminShell";
import { countNewContactMessages } from "@/server/contacts/admin";
import { requireAdmin } from "@/server/session";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdmin();
  const [sidebarState, newContacts] = await Promise.all([
    cookies().then((store) => store.get("sidebar_state")?.value),
    countNewContactMessages(),
  ]);

  return (
    <AdminShell
      defaultOpen={sidebarState !== "false"}
      newContacts={newContacts}
      user={{ name: session.user.name, email: session.user.email }}
    >
      {children}
    </AdminShell>
  );
}
