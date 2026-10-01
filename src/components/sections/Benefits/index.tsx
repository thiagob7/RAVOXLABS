"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LottieFromUrl } from "@/components/animations/LottieFromUrl";
import { ShinyText } from "@/components/animations/ShinyText";
import { AlarmClockCheckIcon } from "@/components/ui/alarm-clock-check";
import { ChartNoAxesColumnIncreasingIcon } from "@/components/ui/chart-no-axes-column-increasing";
import { CircleCheckIcon } from "@/components/ui/circle-check";
import { RocketIcon } from "@/components/ui/rocket";
import { ShieldCheckIcon } from "@/components/ui/shield-check";
import { UsersIcon } from "@/components/ui/users";

import { BenefitCard } from "./components/BenefitCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  {
    icon: RocketIcon,
    title: "Agilidade",
    description: "Entregas rápidas sem comprometer a qualidade do projeto.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Segurança",
    description: "Seus dados e projetos protegidos com as melhores práticas.",
  },
  {
    icon: AlarmClockCheckIcon,
    title: "Pontualidade",
    description: "Cumprimos prazos rigorosamente para sua tranquilidade.",
  },
  {
    icon: ChartNoAxesColumnIncreasingIcon,
    title: "Resultados",
    description: "Foco em métricas que realmente impactam seu negócio.",
  },
  {
    icon: UsersIcon,
    title: "Parceria",
    description: "Relacionamento próximo e suporte contínuo.",
  },
  {
    icon: CircleCheckIcon,
    title: "Qualidade",
    description: "Padrões elevados em cada detalhe do projeto.",
  },
];

export const Benefits = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Header animation - slide from left
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
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

      // Cards stagger animation - alternate from left and right
      if (cardsRef.current) {
        const cards = Array.from(cardsRef.current.children);
        cards.forEach((card, index) => {
          const isEven = index % 2 === 0;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              x: isEven ? -50 : 50,
              y: 30,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }

      // Animação ao lado do título entra junto com o texto
      gsap.fromTo(
        ".reveal-lottie",
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="benefits"
      className="relative overflow-hidden bg-gray-550 py-[120px] max-md:py-16"
    >
      {/* Afastados das bordas: colados nelas, o overflow corta o blur numa linha reta. */}
      <div className="pointer-events-none absolute top-[15%] -right-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[15%] -left-32 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="flex flex-col items-start justify-center container mx-auto max-[1359px]:px-4 max-w-content relative z-10">
        <div className="flex w-full items-center justify-between gap-8">
          <div ref={headerRef}>
            <span className="text-sm font-medium text-blue-500 uppercase tracking-wider mb-4 block">
              POR QUE NOS ESCOLHER
            </span>

            <h2 className="text-4xl font-bold text-start">
              <ShinyText>Benefícios exclusivos</ShinyText>
            </h2>

            <span className="text-lg text-gray-400 text-start mt-4 max-w-2xl block">
              Trabalhamos para entregar não apenas projetos, mas experiências
              que transformam seu negócio.
            </span>
          </div>

          <div className="reveal-lottie pointer-events-none w-[110px] shrink-0 max-md:hidden lg:w-[130px]">
            <LottieFromUrl src="/assets/lottie/quality-badge.json" />
          </div>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 w-full"
        >
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={benefit.title}
              index={index + 1}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
