import type { Metadata } from "next";

import { ProjectList } from "@/components/admin/projects/ProjectList";
import { listProjectsForAdmin } from "@/server/projects/admin";
import { projectImageUrl } from "@/server/storage/project-images";

export const metadata: Metadata = {
  title: "Projetos",
};

export default async function AdminProjectsPage() {
  const rows = await listProjectsForAdmin();

  return (
    <ProjectList
      items={rows.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        summary: row.summary,
        description: row.description,
        client: row.client,
        category: row.category,
        year: row.year,
        tags: row.tags,
        href: row.href,
        featured: row.featured,
        published: row.published,
        thumbnail: row.imageKey ? projectImageUrl(row.imageKey, "md") : null,
        imageUrl: row.imageKey ? projectImageUrl(row.imageKey, "lg") : null,
        accent: row.accent,
      }))}
    />
  );
}
