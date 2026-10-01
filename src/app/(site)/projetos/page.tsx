import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight, FiChevronRight } from "react-icons/fi";

import { PortfolioEmpty } from "@/components/sections/Portfolio/components/PortfolioEmpty";
import { ProjectsExplorer } from "@/components/sections/Portfolio/components/ProjectsExplorer";
import { getPublicProjects } from "@/server/projects/queries";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Conheça o portfólio da RAVOXLABS: sites profissionais, sistemas personalizados e design UI/UX para pequenos negócios.",
  alternates: {
    canonical: "/projetos",
  },
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  const categories = new Set(projects.map((project) => project.category));
  const clients = new Set(
    projects.map((project) => project.client.trim()).filter(Boolean)
  );
  const years = projects.map((project) => project.year);
  const since = years.length ? Math.min(...years) : undefined;

  const stats = [
    { value: projects.length, label: "projetos no portfólio" },
    { value: categories.size, label: "áreas de atuação" },
    clients.size > 0
      ? { value: clients.size, label: "clientes atendidos" }
      : since && { value: since, label: "entregando desde" },
  ].filter(Boolean) as { value: number; label: string }[];

  return (
    <main className="min-h-screen bg-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden pb-16 pt-[136px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,103,242,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(100,103,242,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at 30% 20%, black 20%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-[10%] h-[480px] w-[720px] rounded-full bg-blue-500/[0.08] blur-[120px]"
        />

        <div className="relative mx-auto max-w-content max-[1359px]:px-4">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-gray-400">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-gray-100"
                >
                  Início
                </Link>
              </li>
              <li aria-hidden="true">
                <FiChevronRight className="h-3.5 w-3.5 text-gray-500" />
              </li>
              <li aria-current="page" className="text-gray-100">
                Portfólio
              </li>
            </ol>
          </nav>

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl animate-[fade-in-up_0.6s_ease-out_both]">
              <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
                Nosso portfólio
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Projetos que entregamos
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-gray-400">
                Uma seleção do que já construímos com nossos clientes, de sites
                institucionais a sistemas completos de gestão.
              </p>
            </div>

            {projects.length > 0 && (
              <dl className="grid shrink-0 grid-cols-3 divide-x divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.06] bg-gray-850/80 backdrop-blur-sm [animation-delay:120ms] animate-[fade-in-up_0.6s_ease-out_both]">
                {stats.map((stat) => (
                  <div key={stat.label} className="px-5 py-4 md:px-7">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-2xl font-bold text-white md:text-3xl">
                      {stat.value}
                    </dd>
                    <dd className="mt-1 max-w-[110px] text-xs leading-snug text-gray-400">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* Lista */}
      <section className="relative mx-auto max-w-content pb-24 max-[1359px]:px-4">
        {projects.length > 0 ? (
          <ProjectsExplorer projects={projects} />
        ) : (
          <PortfolioEmpty />
        )}
      </section>

      {/* Chamada final */}
      <section className="mx-auto max-w-content pb-[120px] max-[1359px]:px-4">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gray-850 px-6 py-12 text-center md:px-16 md:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[260px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]"
          />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Seu projeto pode ser o próximo
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-gray-400">
              Conte o que você precisa e receba uma proposta personalizada para
              o seu negócio.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className="group inline-flex h-12 items-center gap-2 rounded-lg bg-blue-500 px-6 text-base font-medium text-white transition-colors hover:bg-blue-500/85"
              >
                Solicitar orçamento
                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/#services"
                className="inline-flex h-12 items-center rounded-lg border border-white/[0.1] px-6 text-base font-medium text-gray-100 transition-colors hover:border-white/25 hover:bg-white/[0.04]"
              >
                Conhecer os serviços
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
