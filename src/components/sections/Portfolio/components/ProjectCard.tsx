import { FiArrowUpRight } from "react-icons/fi";

import { categoryLabels, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

import { ProjectCover } from "./ProjectCover";

interface ProjectCardProps {
  project: Project;
  /** "detailed" mostra descrição e tecnologias (página de projetos). */
  variant?: "compact" | "detailed";
}

export const ProjectCard = ({
  project,
  variant = "compact",
}: ProjectCardProps) => {
  const detailed = variant === "detailed";

  const content = (
    <>
      <div className="relative">
        <ProjectCover
          project={project}
          size="sm"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />

        {project.href && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-gray-900/0 opacity-0 transition-all duration-300 group-hover:bg-gray-900/55 group-hover:opacity-100">
            <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-lg transition-transform duration-300 group-hover:translate-y-0">
              Visitar site
              <FiArrowUpRight className="h-4 w-4" />
            </span>
          </span>
        )}

        <span className="absolute -bottom-3 left-6 z-20 rounded-full border border-white/10 bg-gray-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gray-100">
          {categoryLabels[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-white/[0.06] px-6 pb-6 pt-7">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-sm font-medium text-blue-500">
            {project.summary}
          </span>
          {detailed && (
            <span className="shrink-0 font-mono text-xs text-gray-400">
              {project.year}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-gray-100">
            {project.title}
          </h3>
          {project.href && (
            <FiArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-100" />
          )}
        </div>

        {detailed && project.description && (
          <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-gray-400">
            {project.description}
          </p>
        )}

        {detailed && project.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.tags.slice(0, 4).map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-xs text-gray-400"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  const className = cn(
    "group flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-gray-850 transition-all duration-300 hover:border-white/[0.12]",
    detailed && "hover:-translate-y-1"
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return <article className={className}>{content}</article>;
};
