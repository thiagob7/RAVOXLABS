"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { StatCard } from "./components/StatCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

      // Stats cards stagger animation
      if (statsRef.current) {
        const cards = statsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.4)",
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
    <section ref={sectionRef} id="about" className="relative bg-gray-900 py-[120px] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center justify-center max-w-content mx-auto max-[1359px]:px-4 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8"
        >
          Quem somos
        </h2>

        <div ref={textRef} className="flex flex-col items-center text-center space-y-4">
          <span className="text-lg text-gray-400 leading-relaxed mx-auto">
            A Ravox Labs desenvolve soluções digitais rápidas, modernas e
            acessíveis. <br /> Nosso objetivo é tornar tecnologia e design
            profissional acessíveis para pequenos <br /> empreendedores e
            autônomos que querem melhorar sua presença online.
          </span>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
          <StatCard number="50+" title="Projetos entregues" index={0} />
          <StatCard number="100%" title="Clientes satisfeitos" index={1} />
          <StatCard number="3+" title="Anos de experiência" index={2} />
        </div>
      </div>
    </section>
  );
};
