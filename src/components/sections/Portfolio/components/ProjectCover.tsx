import Image from "next/image";

import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCoverProps {
  project: Project;
  /** "sm" usa a versão média do print (cards). */
  size?: "lg" | "sm";
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Capa do projeto: o print (ou um mockup desenhado em código, enquanto não
 * houver print) dentro de uma janela recuada. O fundo usa a cor de destaque
 * só no mockup; com print de verdade ele fica neutro, para não tingir a foto.
 */
export const ProjectCover = ({
  project,
  size = "lg",
  sizes,
  priority,
  className,
}: ProjectCoverProps) => {
  const accent = project.accent ?? "#6467F2";
  const imageSrc =
    size === "sm" ? (project.imageSmall ?? project.image) : project.image;

  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden",
        className
      )}
      style={{
        background: imageSrc
          ? "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 65%), #0c0e11"
          : `radial-gradient(120% 90% at 50% 0%, ${accent}2e 0%, transparent 65%), #0c0e11`,
      }}
    >
      <div className="absolute inset-x-[7%] -bottom-3 top-[9%] flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-white/10 bg-gray-850 shadow-[0_-10px_40px_rgba(0,0,0,0.35)] transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
        {/* Barra de navegador só no mockup: prints reais costumam já trazer a janela. */}
        {!imageSrc && (
          <div className="flex h-6 shrink-0 items-center gap-1.5 border-b border-white/5 px-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
            <span className="ml-3 h-2.5 w-1/3 rounded bg-white/[0.04]" />
          </div>
        )}

        <div className="relative flex-1">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${project.title} — ${project.client}`}
              fill
              sizes={sizes}
              priority={priority}
              // Prints do painel já chegam redimensionados em WebP pelo backend.
              unoptimized={imageSrc.startsWith("http")}
              className="object-cover object-top"
            />
          ) : (
            <div className="absolute inset-0 p-[5%]">
              {project.category === "sites" && <SiteSkeleton accent={accent} />}
              {project.category === "sistemas" && (
                <DashboardSkeleton accent={accent} />
              )}
              {project.category === "design" && <AppSkeleton accent={accent} />}
            </div>
          )}
        </div>
      </div>

      {project.placeholder && (
        <span className="absolute right-3 top-3 rounded-md border border-white/10 bg-gray-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 backdrop-blur-sm">
          Exemplo
        </span>
      )}
    </div>
  );
};

const Bar = ({ className }: { className?: string }) => (
  <div className={cn("rounded bg-white/[0.07]", className)} />
);

const SiteSkeleton = ({ accent }: { accent: string }) => (
  <div className="flex h-full flex-col gap-[6%]">
    <div className="flex items-center justify-between">
      <Bar className="h-2.5 w-[18%]" />
      <div className="flex w-[35%] justify-end gap-[8%]">
        <Bar className="h-2 w-full" />
        <Bar className="h-2 w-full" />
        <Bar className="h-2 w-full" />
      </div>
    </div>
    <div className="flex flex-col gap-2 pt-[3%]">
      <Bar className="h-4 w-[55%] bg-white/[0.14]" />
      <Bar className="h-4 w-[40%] bg-white/[0.14]" />
      <Bar className="mt-1 h-2 w-[48%]" />
      <div
        className="mt-2 h-5 w-[16%] rounded"
        style={{ backgroundColor: accent }}
      />
    </div>
    <div className="mt-auto grid grid-cols-3 gap-[4%]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-md border border-white/5 bg-white/[0.03]"
        />
      ))}
    </div>
  </div>
);

const DashboardSkeleton = ({ accent }: { accent: string }) => (
  <div className="flex h-full gap-[4%]">
    <div className="flex w-[18%] flex-col gap-2">
      <Bar className="mb-2 h-2.5 w-3/4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Bar key={i} className={cn("h-2", i === 1 ? "w-full" : "w-4/5")} />
      ))}
    </div>
    <div className="flex flex-1 flex-col gap-[5%]">
      <div className="grid grid-cols-3 gap-[4%]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-md border border-white/5 bg-white/[0.03] p-2"
          >
            <Bar className="h-1.5 w-1/2" />
            <Bar className="h-3 w-3/4 bg-white/[0.14]" />
          </div>
        ))}
      </div>
      <div className="flex flex-1 items-end gap-[3%] rounded-md border border-white/5 bg-white/[0.03] p-[4%]">
        {[40, 65, 50, 80, 60, 90, 72, 55, 85, 68].map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${height}%`,
              backgroundColor: accent,
              opacity: i === 5 ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const AppSkeleton = ({ accent }: { accent: string }) => (
  <div className="flex h-full items-end justify-center gap-[5%]">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={cn(
          "flex w-[24%] flex-col gap-2 rounded-t-xl border border-b-0 border-white/10 bg-gray-900 p-[3%]",
          i === 1 ? "h-full" : "h-[85%]"
        )}
      >
        <Bar className="h-2 w-1/2" />
        <div
          className="aspect-square w-full rounded-lg"
          style={{ backgroundColor: accent, opacity: i === 1 ? 0.9 : 0.3 }}
        />
        <Bar className="h-2 w-3/4 bg-white/[0.14]" />
        <Bar className="h-1.5 w-full" />
        <Bar className="h-1.5 w-2/3" />
      </div>
    ))}
  </div>
);
