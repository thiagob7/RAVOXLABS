/**
 * Formato dos documentos no MongoDB.
 *
 * O `_id` é um UUID em texto (gerado pela aplicação), e o código fora desta
 * pasta trabalha com `id` — use `withId` para converter.
 *
 * As coleções do Better Auth (user, session, account, verification) são
 * criadas e mantidas pelo próprio adaptador.
 */

export const COLLECTIONS = {
  projects: "projects",
  contactMessages: "contact_messages",
} as const;

/* -------------------------------------------------------------------------- */
/*                                  Projects                                  */
/* -------------------------------------------------------------------------- */

export type ProjectCategory = "sites" | "sistemas" | "design";

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  client: string;
  category: ProjectCategory;
  year: number;
  tags: string[];
  href: string | null;
  /** Chave base no R2 (sem sufixo de tamanho). */
  imageKey: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  accent: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDoc = Omit<ProjectRow, "id"> & { _id: string };

/* -------------------------------------------------------------------------- */
/*                              Contact messages                              */
/* -------------------------------------------------------------------------- */

export type ContactMessageStatus = "new" | "replied" | "archived";

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ContactMessageDoc = Omit<ContactMessageRow, "id"> & { _id: string };

/* -------------------------------------------------------------------------- */

export function withId<T extends { _id: string }>({ _id, ...rest }: T) {
  return { id: _id, ...rest };
}
