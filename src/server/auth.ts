import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { getDb, getMongoClient } from "./db";
import { serverEnv } from "./env";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  database: mongodbAdapter(getDb(), { client: getMongoClient() }),
  emailAndPassword: {
    enabled: true,
    // Sem cadastro público: admins são criados com `yarn admin:create`.
    disableSignUp: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 20,
  },
  plugins: [nextCookies()],
});
