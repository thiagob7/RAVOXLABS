"use server";

import { headers } from "next/headers";

import {
  contactFieldErrors,
  contactSchema,
  type ContactField,
} from "@/lib/contact-schema";
import { contactMessagesCollection } from "@/server/db";
import { isDatabaseConfigured } from "@/server/env";

export type ContactResult =
  | { status: "saved" }
  | { status: "invalid"; fieldErrors: Partial<Record<ContactField, string>> }
  | { status: "rate_limited" }
  /** Não salvou, mas o cliente ainda deve seguir para o WhatsApp. */
  | { status: "unsaved" };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

/** Limite simples por IP (memória do processo) contra envio em massa. */
function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function submitContactMessage(
  formData: FormData
): Promise<ContactResult> {
  // Honeypot: campo invisível que só robôs preenchem.
  if (String(formData.get("company") ?? "") !== "") {
    return { status: "saved" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) {
    return { status: "invalid", fieldErrors: contactFieldErrors(parsed.error) };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) return { status: "rate_limited" };

  if (!isDatabaseConfigured()) return { status: "unsaved" };

  try {
    const { phone, ...data } = parsed.data;
    const now = new Date();
    await contactMessagesCollection().insertOne({
      _id: crypto.randomUUID(),
      ...data,
      phone: phone || null,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
    return { status: "saved" };
  } catch (error) {
    console.error("[contact] Falha ao salvar mensagem:", error);
    return { status: "unsaved" };
  }
}
