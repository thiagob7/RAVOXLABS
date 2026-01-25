"use client";

import { useRef, useEffect } from "react";
import { FiGlobe, FiGrid, FiLayers } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ServiceCard } from "./components/ServiceCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const services = [
  {
    icon: <FiGlobe className="w-12 h-12" />,
    title: "Sites profissionais",
    description:
      "Sites rápidos, responsivos e modernos criados para fortalecer sua presença digital.",
  },
  {
    icon: <FiGrid className="w-12 h-12" />,
    title: "Sistemas e dashboards",
    description:
      "Desenvolvimento de sistemas personalizados para automação de processos e gestão.",
  },
  {
    icon: <FiLayers className="w-12 h-12" />,
    title: "Design UI/UX",
    description:
      "Interfaces modernas, intuitivas e centradas na experiência do usuário.",
  },
];

export const Services = () => {
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
          { opacity: 0, y: 80, rotateY: -15 },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 1,
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
    <section ref={sectionRef} id="services" className="relative bg-gray-650 py-[120px] overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex flex-col items-center justify-center max-w-content mx-auto max-[1359px]:px-4 relative z-10">
        <div ref={headerRef}>
          <h2 className="text-4xl font-bold text-white text-center">
            Nossos serviços
          </h2>

          <span className="text-lg text-gray-400 text-center mx-auto mt-4 block">
            Soluções completas para transformar sua presença digital
          </span>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 perspective-1000"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
