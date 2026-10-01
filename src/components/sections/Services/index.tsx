"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";

import { AirplayIcon } from "@/components/ui/airplay";
import { ChartNoAxesColumnIncreasingIcon } from "@/components/ui/chart-no-axes-column-increasing";
import { LayoutGridIcon } from "@/components/ui/layout-grid";
import { PaletteIcon } from "@/components/ui/palette";
import { SearchIcon } from "@/components/ui/search";
import { SettingsIcon } from "@/components/ui/settings";
import type { Project } from "@/data/projects";

import { DeviceShowcase } from "./components/DeviceShowcase";
import { ServiceCard } from "./components/ServiceCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Ordem = posição na grade: 0 é o card grande, 1–4 o bloco 2x2 e o
// último vira a faixa larga no fim.
const services = [
  {
    icon: AirplayIcon,
    title: "Sites profissionais",
    description:
      "Sites rápidos, responsivos e modernos criados para fortalecer sua presença digital e trazer clientes.",
  },
  {
    icon: LayoutGridIcon,
    title: "Sistemas e dashboards",
    description:
      "Sistemas personalizados para organizar processos, automatizar a gestão e acompanhar resultados.",
  },
  {
    icon: SearchIcon,
    title: "SEO e presença no Google",
    description:
      "Estrutura e conteúdo otimizados para sua empresa ser encontrada por quem procura.",
  },
  {
    icon: PaletteIcon,
    title: "Design UI/UX",
    description:
      "Interfaces modernas, intuitivas e centradas na experiência do usuário.",
  },
  {
    icon: ChartNoAxesColumnIncreasingIcon,
    title: "Tráfego pago",
    description:
      "Campanhas no Google e nas redes sociais para alcançar as pessoas certas.",
  },
  {
    icon: SettingsIcon,
    title: "Automações e integrações",
    description:
      "Conecte suas ferramentas, automatize tarefas repetitivas e simplifique a rotina do seu negócio.",
  },
];

interface ServicesProps {
  /** Projeto cujo print aparece no card de sites. */
  showcase?: Project;
}

export const Services = ({ showcase }: ServicesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Header animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-gray-650 pt-[120px] pb-16 max-md:pt-20 max-md:pb-8"
    >
      <div className="relative z-10 mx-auto max-w-content max-[1359px]:px-4">
        <div ref={headerRef} className="flex flex-col items-start">
          <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
            O que fazemos
          </span>

          <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Soluções para o seu negócio
            <br />
            <span className="text-blue-500">crescer no digital.</span>
          </h2>
        </div>

        <div
          ref={cardsRef}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]"
        >
          {services.map((service, index) => {
            const featured = index === 0;
            const wide = index === services.length - 1;
            return (
              <ServiceCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href="#get-started"
                index={index}
                featured={featured}
                wide={wide}
                visual={
                  featured ? <DeviceShowcase project={showcase} /> : undefined
                }
                className={
                  featured
                    ? "md:col-span-2 lg:col-span-1 lg:row-span-2"
                    : wide
                      ? "md:col-span-2 lg:col-span-3"
                      : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
