"use server";

import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/server/session";
import { projectsCollection } from "@/server/db";
import {
  getProjectForAdmin,
  nextTopSortOrder,
  swapWithNeighbour,
  uniqueSlug,
} from "@/server/projects/admin";
import { PROJECTS_TAG } from "@/server/projects/queries";
import {
  deleteProjectImage,
  ImageUploadError,
  uploadProjectImage,
} from "@/server/storage/project-images";

export type ProjectFormState = {
  status: "idle" | "error" | "success";
  /** Muda a cada envio bem-sucedido, para o modal reagir. */
  savedAt?: number;
  message?: string;
  fieldErrors?: Partial<Record<string, string>>;
};

const checkbox = z.preprocess((value) => value === "on", z.boolean());

const projectSchema = z.object({
  id: z.uuid().optional(),
  title: z.string().trim().min(2, "Informe o nome do projeto.").max(120),
  slug: z.string().trim().max(80).optional(),
  summary: z
    .string()
    .trim()
    .min(2, "Informe uma frase curta sobre o projeto.")
    .max(160, "Use no máximo 160 caracteres."),
  description: z.string().trim().max(2000).default(""),
  client: z.string().trim().max(120).default(""),
  category: z.enum(["sites", "sistemas", "design"], {
    error: "Escolha uma categoria.",
  }),
  year: z.coerce
    .number({ error: "Ano inválido." })
    .int("Ano inválido.")
    .min(2000, "Ano inválido.")
    .max(2100, "Ano inválido."),
  tags: z.string().default(""),
  href: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https?:\/\/\S+\.\S+/.test(value),
      "Informe um link completo, começando com https://"
    )
    .default(""),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida.")
    .default("#6467F2"),
  featured: checkbox,
  published: checkbox,
  removeImage: checkbox,
});

function revalidateProjects() {
  updateTag(PROJECTS_TAG);
  revalidatePath("/admin/projetos");
}

export async function saveProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, value]) => typeof value === "string")
  );
  if (!raw.id) delete raw.id;

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors,
    };
  }

  const { id, removeImage, tags, href, slug, ...data } = parsed.data;
  const existing = id ? await getProjectForAdmin(id) : null;
  if (id && !existing) {
    return { status: "error", message: "Projeto não encontrado." };
  }

  const file = formData.get("image");
  const hasNewImage = file instanceof File && file.size > 0;

  if (!existing && !hasNewImage) {
    return {
      status: "error",
      message: "Envie o print do projeto.",
      fieldErrors: { image: "Envie o print do projeto." },
    };
  }

  let uploaded: Awaited<ReturnType<typeof uploadProjectImage>> | null = null;
  if (hasNewImage) {
    try {
      uploaded = await uploadProjectImage(file);
    } catch (error) {
      const message =
        error instanceof ImageUploadError
          ? error.message
          : "Não foi possível enviar a imagem. Tente novamente.";
      if (!(error instanceof ImageUploadError)) {
        console.error("[admin] Falha no upload:", error);
      }
      return { status: "error", message, fieldErrors: { image: message } };
    }
  }

  const values = {
    ...data,
    href: href || null,
    tags: tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 12),
    slug: await uniqueSlug(slug || data.title, existing?.id),
  };

  const imageValues = uploaded
    ? {
        imageKey: uploaded.key,
        imageWidth: uploaded.width,
        imageHeight: uploaded.height,
      }
    : removeImage
      ? { imageKey: null, imageWidth: null, imageHeight: null }
      : {};

  try {
    const now = new Date();
    if (existing) {
      await projectsCollection().updateOne(
        { _id: existing.id },
        { $set: { ...values, ...imageValues, updatedAt: now } }
      );
    } else {
      await projectsCollection().insertOne({
        _id: crypto.randomUUID(),
        ...values,
        imageKey: null,
        imageWidth: null,
        imageHeight: null,
        ...imageValues,
        sortOrder: await nextTopSortOrder(),
        createdAt: now,
        updatedAt: now,
      });
    }
  } catch (error) {
    console.error("[admin] Falha ao salvar projeto:", error);
    if (uploaded) await deleteProjectImage(uploaded.key).catch(() => {});
    return {
      status: "error",
      message: "Não foi possível salvar o projeto. Tente novamente.",
    };
  }

  // A imagem antiga só é apagada depois que o banco já aponta para a nova.
  if (existing?.imageKey && (uploaded || removeImage)) {
    await deleteProjectImage(existing.imageKey).catch((error) =>
      console.error("[admin] Falha ao apagar imagem antiga:", error)
    );
  }

  revalidateProjects();
  return {
    status: "success",
    savedAt: Date.now(),
    message: existing ? "Alterações salvas." : "Projeto criado com sucesso.",
  };
}

export async function deleteProject(id: string) {
  await requireAdmin();

  const existing = await getProjectForAdmin(id);
  if (!existing) return;

  await projectsCollection().deleteOne({ _id: id });
  await deleteProjectImage(existing.imageKey).catch((error) =>
    console.error("[admin] Falha ao apagar imagem:", error)
  );

  revalidateProjects();
}

export async function toggleProjectFlag(
  id: string,
  flag: "featured" | "published"
) {
  await requireAdmin();

  const existing = await getProjectForAdmin(id);
  if (!existing) return;

  await projectsCollection().updateOne(
    { _id: id },
    { $set: { [flag]: !existing[flag], updatedAt: new Date() } }
  );

  revalidateProjects();
}

export async function moveProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  await swapWithNeighbour(id, direction);
  revalidateProjects();
}
