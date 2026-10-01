import "server-only";

import { MongoClient, type Collection, type Db } from "mongodb";

import { serverEnv } from "../env";
import { COLLECTIONS, type ContactMessageDoc, type ProjectDoc } from "./schema";

const globalForDb = globalThis as unknown as {
  ravoxMongo?: { client: MongoClient; db: Db };
};

/** Conexão criada sob demanda e reaproveitada entre os hot reloads do dev. */
function connection() {
  if (!globalForDb.ravoxMongo) {
    // O driver só abre a conexão de fato na primeira operação.
    const client = new MongoClient(serverEnv.MONGODB_URI, { maxPoolSize: 10 });
    globalForDb.ravoxMongo = {
      client,
      db: client.db(serverEnv.MONGODB_DB),
    };
  }
  return globalForDb.ravoxMongo;
}

export const getMongoClient = () => connection().client;
export const getDb = () => connection().db;

export const projectsCollection = (): Collection<ProjectDoc> =>
  getDb().collection<ProjectDoc>(COLLECTIONS.projects);

export const contactMessagesCollection = (): Collection<ContactMessageDoc> =>
  getDb().collection<ContactMessageDoc>(COLLECTIONS.contactMessages);

/** Índices das coleções do site. Rodado por `yarn db:setup`. */
export async function ensureIndexes() {
  await projectsCollection().createIndexes([
    { key: { slug: 1 }, unique: true, name: "projects_slug_unique" },
    { key: { sortOrder: 1, createdAt: -1 }, name: "projects_sort_idx" },
  ]);
  await contactMessagesCollection().createIndexes([
    { key: { status: 1 }, name: "contact_messages_status_idx" },
    { key: { createdAt: -1 }, name: "contact_messages_created_idx" },
  ]);
}
