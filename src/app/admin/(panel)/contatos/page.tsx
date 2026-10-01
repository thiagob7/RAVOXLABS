import type { Metadata } from "next";

import { ContactList } from "@/components/admin/contacts/ContactList";
import { listContactMessages } from "@/server/contacts/admin";

export const metadata: Metadata = {
  title: "Contatos",
};

export default async function AdminContactsPage() {
  const rows = await listContactMessages();

  return (
    <ContactList
      items={rows.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
      }))}
    />
  );
}
