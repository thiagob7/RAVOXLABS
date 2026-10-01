/**
 * Cria os índices do MongoDB (slug único, ordenação, filtros de contato).
 * Pode rodar quantas vezes quiser:
 *
 *   yarn db:setup
 */
import { ensureIndexes, getMongoClient } from "../src/server/db";

ensureIndexes()
  .then(() => console.log("Índices criados."))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => getMongoClient().close());
