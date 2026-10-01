/**
 * Cria (ou redefine a senha de) um usuário do painel.
 *
 *   yarn admin:create --email voce@ravoxlabs.com --name "Seu Nome"
 *
 * A senha é pedida no terminal (ou via ADMIN_PASSWORD).
 */
import { createInterface } from "node:readline/promises";
import { parseArgs } from "node:util";

import { auth } from "../src/server/auth";

async function askPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  // Sem terminal interativo a pergunta nunca é respondida e o processo sairia
  // calado; nesse caso falha pedindo o ADMIN_PASSWORD.
  const closed = new Promise<never>((_, reject) =>
    rl.once("close", () =>
      reject(
        new Error("Sem terminal interativo: passe a senha em ADMIN_PASSWORD.")
      )
    )
  );
  closed.catch(() => {}); // o close normal, depois da resposta, não é erro
  const answer = await Promise.race([
    rl.question("Senha (mín. 8 caracteres): "),
    closed,
  ]);
  rl.close();
  return answer;
}

async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: "string" },
      name: { type: "string" },
    },
  });

  const email = values.email?.trim().toLowerCase();
  if (!email) throw new Error("Informe --email");

  const password = await askPassword();
  if (password.length < 8) throw new Error("A senha precisa de 8+ caracteres.");

  const ctx = await auth.$context;
  const hash = await ctx.password.hash(password);

  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing) {
    await ctx.internalAdapter.updatePassword(existing.user.id, hash);
    if (values.name) {
      await ctx.internalAdapter.updateUser(existing.user.id, {
        name: values.name,
      });
    }
    console.log(`Senha atualizada para ${email}.`);
    return;
  }

  const created = await ctx.internalAdapter.createUser(
    {
      email,
      name: values.name?.trim() || email.split("@")[0],
      emailVerified: true,
    },
    { method: "email-password" }
  );

  await ctx.internalAdapter.linkAccount({
    userId: created.id,
    providerId: "credential",
    accountId: created.id,
    password: hash,
  });

  console.log(`Admin criado: ${email}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
