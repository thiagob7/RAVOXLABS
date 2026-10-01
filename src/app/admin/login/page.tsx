import type { Metadata } from "next";
import Image from "next/image";

import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />

      <div className="relative w-full max-w-[400px]">
        <Image
          src="/assets/img/Logo.png"
          alt="RAVOX Labs"
          width={160}
          height={48}
          priority
          className="mx-auto h-auto w-[140px]"
        />

        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-850 p-6">
          <h1 className="text-xl font-semibold text-white">Acessar painel</h1>
          <p className="mt-1 text-sm text-gray-300">
            Entre com sua conta para gerenciar os projetos.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
