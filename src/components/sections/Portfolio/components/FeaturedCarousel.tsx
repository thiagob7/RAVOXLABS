"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";

import { categoryLabels, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

import { ProjectCover } from "./ProjectCover";

interface FeaturedCarouselProps {
  projects: Project[];
}

const AUTOPLAY_DELAY = 6000;

const pad = (n: number) => String(n).padStart(2, "0");

const hostnameOf = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

export const FeaturedCarousel = ({ projects }: FeaturedCarouselProps) => {
  // Quem pediu menos movimento no sistema não recebe autoplay.
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      // Mantém o slide centralizado mesmo com poucos projetos.
      containScroll: false,
    },
    reducedMotion
      ? []
      : [
          Autoplay({
            delay: AUTOPLAY_DELAY,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }),
        ]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const current = projects[selectedIndex];

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-label="Projetos em destaque"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") scrollPrev();
        if (e.key === "ArrowRight") scrollNext();
      }}
    >
      {/* Slides: full-bleed so neighbours peek on both sides */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-4 flex md:-ml-6">
          {projects.map((project, index) => {
            const isActive = index === selectedIndex;

            return (
              <div
                key={project.slug}
                className="min-w-0 shrink-0 grow-0 basis-[calc(min(100%_-_48px,1359px)_+_16px)] pl-4 md:basis-[calc(min(100%_-_56px,1359px)_+_24px)] md:pl-6"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${projects.length}`}
                aria-hidden={!isActive}
              >
                <SlideFrame
                  href={isActive ? project.href : undefined}
                  onClick={() => !isActive && emblaApi?.scrollTo(index)}
                  className={cn(
                    "group relative block overflow-hidden rounded-xl border bg-gray-850 transition-all duration-500 ease-out",
                    isActive
                      ? "border-white/[0.1] opacity-100"
                      : "scale-[0.94] cursor-pointer border-white/[0.04] opacity-40 hover:opacity-60"
                  )}
                >
                  <ProjectCover
                    project={project}
                    priority={index === 0}
                    sizes="(min-width: 1400px) 1359px, 100vw"
                    className="aspect-[16/10] md:aspect-[21/9]"
                  />

                  {isActive && project.href && (
                    <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-gray-900/0 opacity-0 transition-all duration-300 group-hover:bg-gray-900/55 group-hover:opacity-100 group-hover:backdrop-blur-[2px]">
                      <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-xl shadow-black/30 transition-transform duration-300 group-hover:translate-y-0">
                        Visitar site
                        <FiArrowUpRight className="h-4 w-4" />
                      </span>
                    </span>
                  )}
                </SlideFrame>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info + controls, outside the card */}
      <div className="mx-auto mt-8 flex max-w-content flex-col gap-6 max-[1359px]:px-4 md:flex-row md:items-end md:justify-between">
        <div key={current?.slug} className="animate-[fade-in-up_0.5s_ease-out]">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            {current && categoryLabels[current.category]} · {current?.year}
          </span>
          <h3 className="mt-2 text-2xl font-bold text-gray-100 md:text-3xl">
            {current?.title}
          </h3>
          <p className="mt-1 text-base text-gray-400">{current?.summary}</p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          {projects.length > 1 && (
            <div className="flex items-center gap-4">
              <CarouselButton onClick={scrollPrev} label="Projeto anterior">
                <FiArrowLeft className="h-4 w-4" />
              </CarouselButton>
              <span className="font-mono text-sm tabular-nums text-gray-400">
                <span className="text-gray-100">{pad(selectedIndex + 1)}</span>
                <span className="mx-2 text-gray-600">•</span>
                {pad(projects.length)}
              </span>
              <CarouselButton onClick={scrollNext} label="Próximo projeto">
                <FiArrowRight className="h-4 w-4" />
              </CarouselButton>
            </div>
          )}

          {current?.href && (
            <a
              href={current.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 text-xs font-medium uppercase tracking-wider text-gray-400 transition-colors duration-300 hover:border-white/20 hover:text-gray-100"
            >
              Veja online
              <span className="text-sm normal-case tracking-normal text-gray-100">
                {hostnameOf(current.href)}
              </span>
              <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

/** Slide ativo com link vira um <a> para o site; os demais são só clicáveis. */
const SlideFrame = ({
  href,
  onClick,
  className,
  children,
}: {
  href?: string;
  onClick: () => void;
  className: string;
  children: React.ReactNode;
}) =>
  href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visitar site do projeto"
      className={className}
    >
      {children}
    </a>
  ) : (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );

const CarouselButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-gray-100 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
  >
    {children}
  </button>
);
