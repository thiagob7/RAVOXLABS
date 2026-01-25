"use client";

import { useRef, useEffect } from "react";
import {
  FiZap,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BenefitCard } from "./components/BenefitCard";
import { ShinyText } from "@/components/animations/ShinyText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  {
    icon: <FiZap className="w-6 h-6" />,
    title: "Agilidade",
    description: "Entregas rápidas sem comprometer a qualidade do projeto.",
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Segurança",
    description: "Seus dados e projetos protegidos com as melhores práticas.",
  },
  {
    icon: <FiClock className="w-6 h-6" />,
    title: "Pontualidade",
    description: "Cumprimos prazos rigorosamente para sua tranquilidade.",
  },
  {
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: "Resultados",
    description: "Foco em métricas que realmente impactam seu negócio.",
  },
  {
    icon: <FiUsers className="w-6 h-6" />,
    title: "Parceria",
    description: "Relacionamento próximo e suporte contínuo.",
  },
  {
    icon: <FiCheckCircle className="w-6 h-6" />,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="benefits" className="relative bg-gray-550 py-[120px] overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="flex flex-col items-start justify-center container mx-auto max-[1359px]:px-4 max-w-content relative z-10">
        <div ref={headerRef}>
          <span className="text-sm font-medium text-blue-500 uppercase tracking-wider mb-4 block">
            POR QUE NOS ESCOLHER
          </span>

          <h2 className="text-4xl font-bold text-start">
            <ShinyText>Benefícios exclusivos</ShinyText>
          </h2>

          <span className="text-lg text-gray-400 text-start mt-4 max-w-2xl block">
            Trabalhamos para entregar não apenas projetos, mas experiências que
            transformam seu negócio.
          </span>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 w-full"
        >
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
