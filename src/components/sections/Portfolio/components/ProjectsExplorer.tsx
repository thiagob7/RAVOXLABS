"use client";

import { useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  FiGrid,
  FiLayout,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiX,
} from "react-icons/fi";

import {
  categoryOptions,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { cn } from "@/lib/utils";

import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { ProjectCard } from "./ProjectCard";

type Filter = "todos" | ProjectCategory;

const categoryIcons: Record<Filter, IconType> = {
  todos: FiGrid,
  sites: FiMonitor,
  sistemas: FiLayout,
  design: FiPenTool,
};

const filters: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...categoryOptions,
];

interface ProjectsExplorerProps {
  projects: Project[];
}

export const ProjectsExplorer = ({ projects }: ProjectsExplorerProps) => {
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");

  const term = search.trim().toLowerCase();
  const isFiltering = filter !== "todos" || term !== "";

  const visibleProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          (filter === "todos" || project.category === filter) &&
          (!term ||
            [
              project.title,
              project.summary,
              project.client,
              project.description,
              ...project.tags,
            ].some((value) => value.toLowerCase().includes(term)))
      ),
    [projects, filter, term]
  );

  // Sem filtros, o primeiro projeto em destaque ganha o card grande.
  const spotlight = isFiltering
    ? undefined
    : (visibleProjects.find((project) => project.featured) ??
      visibleProjects[0]);
  const gridProjects = visibleProjects.filter(
    (project) => project !== spotlight
  );

  const countFor = (value: Filter) =>
    value === "todos"
      ? projects.length
      : projects.filter((project) => project.category === value).length;

  const clearFilters = () => {
    setFilter("todos");
    setSearch("");
  };

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-y border-white/[0.06] bg-gray-900/85 px-4 py-4 backdrop-blur-md md:mx-0 md:rounded-xl md:border md:px-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filtrar projetos por categoria"
            className="flex gap-2 overflow-x-auto"
          >
            {filters.map(({ value, label }) => {
              const Icon = categoryIcons[value];
              const active = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "border-blue-500/40 bg-blue-500/15 text-white"
                      : "border-white/[0.06] text-gray-400 hover:border-white/[0.14] hover:text-gray-100"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-blue-500")} />
                  {label}
                  <span
                    className={cn(
                      "rounded-md px-1.5 py-0.5 font-mono text-[11px]",
                      active
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-white/[0.05] text-gray-400"
                    )}
                  >
                    {countFor(value)}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="relative lg:w-80">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar projeto, cliente ou tecnologia"
              aria-label="Buscar projetos"
              className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-10 pr-9 text-sm text-gray-100 outline-none transition-colors placeholder:text-gray-500 hover:border-white/[0.16] focus:border-blue-500/70 focus:ring-4 focus:ring-blue-500/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-gray-400 hover:bg-white/[0.06] hover:text-gray-100"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
        <span>
          {visibleProjects.length}{" "}
          {visibleProjects.length === 1
            ? "projeto encontrado"
            : "projetos encontrados"}
        </span>
        {isFiltering && (
          <button
            type="button"
            onClick={clearFilters}
            className="cursor-pointer text-blue-500 hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {visibleProjects.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-white/10 px-6 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400">
            <FiSearch className="h-5 w-5" />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-gray-100">
            Nenhum projeto encontrado
          </h3>
          <p className="mt-1 max-w-sm text-sm text-gray-400">
            Tente outra categoria ou um termo de busca diferente.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex h-10 cursor-pointer items-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-sm font-medium text-gray-100 transition-colors hover:border-white/20"
          >
            Ver todos os projetos
          </button>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-6">
          {spotlight && <FeaturedProjectCard project={spotlight} />}

          {gridProjects.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  variant="detailed"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
