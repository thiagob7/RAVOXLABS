import "server-only";

import { projectsCollection } from "../db";
import { withId } from "../db/schema";
import { projectOrder } from "./queries";

export async function listProjectsForAdmin() {
  const docs = await projectsCollection().find().sort(projectOrder).toArray();
  return docs.map(withId);
}

export async function getProjectForAdmin(id: string) {
  const doc = await projectsCollection().findOne({ _id: id });
  return doc ? withId(doc) : null;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Gera um slug livre, adicionando -2, -3... quando já existe. */
export async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "projeto";

  for (let attempt = 1; ; attempt++) {
    const candidate = attempt === 1 ? root : `${root}-${attempt}`;
    const taken = await projectsCollection().findOne(
      ignoreId
        ? { slug: candidate, _id: { $ne: ignoreId } }
        : { slug: candidate },
      { projection: { _id: 1 } }
    );
    if (!taken) return candidate;
  }
}

/** Novos projetos entram no topo da lista. */
export async function nextTopSortOrder() {
  const top = await projectsCollection().findOne(
    {},
    { sort: { sortOrder: 1 }, projection: { sortOrder: 1 } }
  );
  return (top?.sortOrder ?? 1) - 1;
}

/** Troca a posição do projeto com o vizinho de cima/baixo. */
export async function swapWithNeighbour(id: string, direction: "up" | "down") {
  const ordered = await listProjectsForAdmin();
  const index = ordered.findIndex((project) => project.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || !ordered[target]) return;

  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];

  // Regrava a ordem inteira (0..n) para não depender de valores antigos.
  const updates = ordered.flatMap((project, position) =>
    project.sortOrder === position
      ? []
      : [
          {
            updateOne: {
              filter: { _id: project.id },
              update: { $set: { sortOrder: position, updatedAt: new Date() } },
            },
          },
        ]
  );
  if (updates.length > 0) await projectsCollection().bulkWrite(updates);
}
