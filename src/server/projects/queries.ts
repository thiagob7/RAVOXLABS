import "server-only";

import type { Sort } from "mongodb";
import { unstable_cache } from "next/cache";

import { placeholderProjects, type Project } from "@/data/projects";

import { projectsCollection } from "../db";
import { withId, type ProjectRow } from "../db/schema";
import { isDatabaseConfigured } from "../env";
import { projectImageUrl } from "../storage/project-images";

export const PROJECTS_TAG = "projects";

export const projectOrder: Sort = { sortOrder: 1, createdAt: -1 };

export function toPublicProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    client: row.client,
    category: row.category,
    year: row.year,
    tags: row.tags,
    href: row.href ?? undefined,
    image: row.imageKey ? projectImageUrl(row.imageKey, "lg") : undefined,
    imageSmall: row.imageKey ? projectImageUrl(row.imageKey, "md") : undefined,
    featured: row.featured,
    accent: row.accent,
  };
}

const loadPublishedProjects = unstable_cache(
  async () => {
    const docs = await projectsCollection()
      .find({ published: true })
      .sort(projectOrder)
      .toArray();
    return docs.map(withId);
  },
  ["published-projects"],
  { tags: [PROJECTS_TAG] }
);

/**
 * Projetos publicados para o site. Enquanto o banco não estiver configurado
 * ou não houver projetos publicados, retorna os exemplos.
 */
export async function getPublicProjects(): Promise<Project[]> {
  if (!isDatabaseConfigured()) return placeholderProjects;

  try {
    const rows = await loadPublishedProjects();
    return rows.length > 0 ? rows.map(toPublicProject) : placeholderProjects;
  } catch (error) {
    console.error("[projects] Falha ao carregar projetos:", error);
    return placeholderProjects;
  }
}
