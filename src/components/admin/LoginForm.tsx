"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FiAlertCircle } from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

import { Button } from "./Button";
import { Input } from "./form/Field";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const { error: signInError } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    if (signInError) {
      setPending(false);
      setError(
        signInError.status === 429
          ? "Muitas tentativas. Aguarde um minuto e tente de novo."
          : "E-mail ou senha incorretos."
      );
      return;
    }

    router.replace("/admin/projetos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <Input
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="voce@ravoxlabs.com"
      />
      <Input
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-300"
        >
          <FiAlertCircle className="shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" size="md" loading={pending} className="mt-2 w-full">
        Entrar
      </Button>
    </form>
  );
}
