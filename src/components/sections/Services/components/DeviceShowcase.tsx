import Image from "next/image";

import type { Project } from "@/data/projects";

import { ProjectCover } from "../../Portfolio/components/ProjectCover";

interface DeviceShowcaseProps {
  /** Projeto com print; sem ele, cai no mockup desenhado do portfólio. */
  project?: Project;
}

/** Notebook + celular exibindo o print de um projeto real. */
export const DeviceShowcase = ({ project }: DeviceShowcaseProps) => {
  const src = project?.image;

  if (!src || !project) {
    return project ? (
      <ProjectCover
        project={project}
        sizes="(max-width: 1024px) 100vw, 640px"
        className="rounded-xl"
      />
    ) : null;
  }

  const alt = `${project.title} — ${project.client}`;
  const unoptimized = src.startsWith("http");

  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-[6%] pr-[10%]">
      {/* Brilho atrás dos aparelhos */}
      <div className="absolute inset-[15%] rounded-full bg-blue-500/20 blur-[70px]" />

      {/* Notebook */}
      <div className="relative transition-transform duration-700 ease-out group-hover:-translate-y-1">
        <div className="rounded-t-[14px] border border-white/15 bg-[#0B0C0F] p-[2.2%] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-gray-850">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 90vw, 520px"
              unoptimized={unoptimized}
              className="object-cover object-top"
            />
          </div>
        </div>
        {/* Base do notebook */}
        <div className="relative mx-[-5%] h-[10px] rounded-b-[10px] bg-gradient-to-b from-[#3A3D46] to-[#1B1D22]">
          <span className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-md bg-[#15171B]" />
        </div>
      </div>

      {/* Celular */}
      <div className="absolute bottom-0 right-0 w-[24%] transition-transform duration-700 ease-out group-hover:-translate-y-2">
        <div className="rounded-[18px] border border-white/20 bg-[#0B0C0F] p-[5%] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[13px] bg-gray-850">
            <Image
              src={src}
              alt=""
              fill
              sizes="140px"
              unoptimized={unoptimized}
              className="object-cover object-left-top"
            />
            <span className="absolute left-1/2 top-[3%] h-[3%] w-[34%] -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
};
