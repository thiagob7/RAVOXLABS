import "server-only";

import { z } from "zod";

const schema = z.object({
  /** Connection string do MongoDB (Atlas: mongodb+srv://...). */
  MONGODB_URI: z
    .string()
    .regex(/^mongodb(\+srv)?:\/\//, "deve começar com mongodb://"),
  MONGODB_DB: z.string().min(1).default("ravox"),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  /** URL pública do bucket (domínio próprio ou *.r2.dev), sem barra no final. */
  R2_PUBLIC_URL: z.string().url(),
  /** Endpoint S3 opcional (ex: MinIO local). Por padrão usa o do R2. */
  R2_ENDPOINT: z.string().url().optional(),
});

type ServerEnv = z.infer<typeof schema>;

let cached: ServerEnv | undefined;

function load(): ServerEnv {
  if (cached) return cached;

  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const missing = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Variáveis de ambiente inválidas ou ausentes: ${missing}`);
  }

  cached = parsed.data;
  return cached;
}

/** Lido sob demanda para não quebrar o build quando o painel não está configurado. */
export const serverEnv = new Proxy({} as ServerEnv, {
  get: (_, key: string) => load()[key as keyof ServerEnv],
});

export const isDatabaseConfigured = () => Boolean(process.env.MONGODB_URI);
