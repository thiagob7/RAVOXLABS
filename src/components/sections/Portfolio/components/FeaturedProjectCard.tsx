import { FiArrowUpRight, FiStar } from "react-icons/fi";

import { categoryLabels, type Project } from "@/data/projects";

import { ProjectCover } from "./ProjectCover";

const hostnameOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

/** Projeto em destaque no topo da página de projetos. */
export const FeaturedProjectCard = ({ project }: { project: Project }) => (
  <article className="group grid overflow-hidden rounded-xl border border-white/[0.08] bg-gray-850 lg:grid-cols-[1.5fr_1fr]">
    <div className="relative">
      <ProjectCover
        project={project}
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="lg:aspect-auto lg:h-full lg:min-h-[380px]"
      />
    </div>

    <div className="flex flex-col border-white/[0.06] p-6 max-lg:border-t md:p-10 lg:border-l">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-500">
        <FiStar className="h-3 w-3 fill-current" />
        Em destaque
      </span>

      <span className="mt-6 text-xs font-medium uppercase tracking-wider text-gray-400">
        {categoryLabels[project.category]} · {project.year}
        {project.client && ` · ${project.client}`}
      </span>
      <h2 className="mt-2 text-3xl font-bold leading-tight text-white">
        {project.title}
      </h2>
      <p className="mt-2 text-base font-medium text-blue-500">
        {project.summary}
      </p>
      {project.description && (
        <p className="mt-4 text-[15px] leading-relaxed text-gray-400">
          {project.description}
        </p>
      )}

      {project.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link mt-auto inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100 max-lg:mt-8 lg:mt-10"
        >
          Visitar {hostnameOf(project.href)}
          <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </a>
      )}
    </div>
  </article>
);
