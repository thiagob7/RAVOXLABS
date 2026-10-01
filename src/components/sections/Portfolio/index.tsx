"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";

import { splitProjects, type Project } from "@/data/projects";

import { FeaturedCarousel } from "./components/FeaturedCarousel";
import { PortfolioEmpty } from "./components/PortfolioEmpty";
import { ProjectCard } from "./components/ProjectCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PortfolioProps {
  projects: Project[];
}

export const Portfolio = ({ projects }: PortfolioProps) => {
  const { featured, others } = splitProjects(projects);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveal = (
        targets: gsap.TweenTarget,
        trigger: Element | null,
        stagger = 0
      ) => {
        if (!trigger) return;
        gsap.fromTo(
          targets,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      };

      reveal(headerRef.current?.children ?? [], headerRef.current, 0.12);
      reveal(carouselRef.current, carouselRef.current);
      reveal(cardsRef.current?.children ?? [], cardsRef.current, 0.12);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative overflow-hidden bg-gray-900 py-[120px]"
    >
      {/* Soft ambient light behind the carousel */}
      <div className="pointer-events-none absolute left-1/2 top-40 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/[0.06] blur-[120px]" />

      <div
        ref={headerRef}
        className="relative z-10 mx-auto flex max-w-content flex-col items-center text-center max-[1359px]:px-4"
      >
        <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
          Nosso portfólio
        </span>
        <h2 className="text-4xl font-bold text-white">
          Projetos que entregamos
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-gray-400">
          Sites, sistemas e interfaces criados para resolver problemas reais e
          gerar resultado para nossos clientes.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="relative z-10 mx-auto mt-14 max-w-content max-[1359px]:px-4">
          <PortfolioEmpty />
        </div>
      ) : (
        <>
          <div ref={carouselRef} className="relative z-10 mt-14">
            {featured.length > 0 && <FeaturedCarousel projects={featured} />}
          </div>

          <div className="relative z-10 mx-auto max-w-content max-[1359px]:px-4">
            {others.length > 0 && (
              <>
                <div className="mt-20 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div
                  ref={cardsRef}
                  className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {others.slice(0, 3).map((project) => (
                    <ProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </>
            )}

            <div className="mt-12 flex justify-center">
              <ViewAllLink />
            </div>
          </div>
        </>
      )}
    </section>
  );
};

const ViewAllLink = () => (
  <Link
    href="/projetos"
    className="group inline-flex h-12 items-center gap-2 rounded-xl bg-blue-500 px-7 text-base font-medium text-white transition-colors duration-300 hover:bg-blue-500/80 hover:shadow-lg hover:shadow-blue-500/20"
  >
    Ver todo o portfólio
    <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
  </Link>
);
