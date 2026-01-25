"use client";

import { useRef, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/animations/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Budget = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Content animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animated line at bottom
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
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
      id="get-started"
      className="relative py-[120px] bg-gray-900 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-budget bg-no-repeat bg-cover bg-center opacity-50"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gray-900/60" />

      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-transparent to-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-transparent to-gray-900/40" />

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div
        ref={contentRef}
        className="flex flex-col items-center justify-center mx-auto max-[1359px]:px-4 max-w-content relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 leading-tight">
          Pronto para transformar <br className="hidden md:block" />
          seu negócio?
        </h2>

        <p className="text-lg text-gray-300 text-center mb-10 max-w-2xl mx-auto leading-relaxed">
          Fale com nossa equipe e receba um orçamento rápido e personalizado.
        </p>

        <MagneticButton strength={0.2}>
          <Button
            href="#contact"
            variant="white"
            className="group gap-2 hover:shadow-xl hover:shadow-white/20 transition-shadow duration-300"
          >
            Solicitar orçamento
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </MagneticButton>
      </div>

      {/* Animated gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden z-20">
        <div
          ref={lineRef}
          className="absolute inset-0 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(100, 103, 242, 0.3) 20%, rgba(100, 103, 242, 0.8) 50%, rgba(100, 103, 242, 0.3) 80%, transparent 100%)",
          }}
        />
      </div>
    </section>
  );
};
