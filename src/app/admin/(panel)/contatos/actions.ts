"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  deleteContactMessage,
  updateContactMessageStatus,
} from "@/server/contacts/admin";
import type { ContactMessageStatus } from "@/server/db/schema";
import { requireAdmin } from "@/server/session";

const idSchema = z.uuid();
const statusSchema = z.enum(["new", "replied", "archived"]);

function revalidateContacts() {
  // O layout do painel mostra o total de novas mensagens na sidebar.
  revalidatePath("/admin", "layout");
}

export async function setContactStatus(
  id: string,
  status: ContactMessageStatus
) {
  await requireAdmin();
  await updateContactMessageStatus(
    idSchema.parse(id),
    statusSchema.parse(status)
  );
  revalidateContacts();
}

export async function removeContactMessage(id: string) {
  await requireAdmin();
  await deleteContactMessage(idSchema.parse(id));
  revalidateContacts();
}
