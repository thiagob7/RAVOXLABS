"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import {
  FiAward,
  FiCheck,
  FiClock,
  FiLayers,
  FiMessageCircle,
} from "react-icons/fi";

import { Button } from "@/components/ui/Button";

import { StatCard } from "./components/StatCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const principles = [
  "Atendimento próximo, sem burocracia",
  "Preço justo para quem está começando",
  "Design e código feitos sob medida",
];

const steps = [
  {
    title: "Entendemos seu negócio",
    description: "Conversamos sobre seus objetivos, público e prazos.",
  },
  {
    title: "Criamos a solução",
    description: "Design e desenvolvimento com você acompanhando cada etapa.",
  },
  {
    title: "Lançamos e acompanhamos",
    description: "Colocamos no ar e seguimos por perto no suporte.",
  },
];

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Text animation
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Princípios
      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Stats cards stagger animation
      if (statsRef.current) {
        const cards = statsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
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
      id="about"
      className="relative bg-gray-900 py-[120px] overflow-hidden"
    >
      <div className="absolute top-0 left-0 z-10 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      {/* Background glow atrás dos cards */}
      <div className="pointer-events-none absolute right-[10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/[0.07] blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-14 max-[1359px]:px-4 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* Texto */}
        <div>
          <div ref={titleRef}>
            <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
              Quem somos
            </span>
            <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Tecnologia profissional,
              <br />
              do tamanho do <span className="text-blue-500">seu negócio.</span>
            </h2>
          </div>

          {/* Sem <br /> fixo: a quebra muda conforme a largura da tela. */}
          <p
            ref={textRef}
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400"
          >
            A Ravox Labs desenvolve soluções digitais rápidas, modernas e
            acessíveis. Nosso objetivo é tornar tecnologia e design profissional
            acessíveis para pequenos empreendedores e autônomos que querem
            melhorar sua presença online.
          </p>

          <ul ref={listRef} className="mt-8 flex flex-col gap-3">
            {principles.map((item) => (
              <li key={item} className="flex items-center gap-3 text-gray-100">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-500">
                  <FiCheck className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Button href="#contact" className="mt-10 gap-2">
            <FiMessageCircle className="h-[18px] w-[18px]" />
            Converse com a gente
          </Button>
        </div>

        {/* Números + processo */}
        <div ref={statsRef} className="grid grid-cols-2 gap-4">
          <StatCard
            number="50+"
            title="Projetos entregues"
            icon={FiLayers}
            index={0}
          />
          <StatCard
            number="100%"
            title="Clientes satisfeitos"
            icon={FiAward}
            index={1}
          />

          <div className="col-span-2 rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Como trabalhamos
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <FiClock className="h-4 w-4 text-blue-500" />
                <span>
                  <span className="font-semibold text-white">3+</span> anos de
                  experiência
                </span>
              </span>
            </div>

            <ol className="mt-6 grid gap-5 sm:grid-cols-3 sm:gap-4">
              {steps.map((step, i) => (
                <li key={step.title} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-mono text-xs font-semibold text-blue-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < steps.length - 1 && (
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent sm:block" />
                    )}
                  </div>
                  <h3 className="mt-4 text-[15px] font-semibold text-gray-100">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
