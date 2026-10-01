"use client";

import { useRef, useEffect } from "react";
import { FiArrowRight, FiCheck, FiGrid } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Button } from "@/components/ui/Button";
import { LottieFromUrl } from "@/components/animations/LottieFromUrl";
import { MagneticButton } from "@/components/animations/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = [
  "Resposta em até 24h",
  "Orçamento sem compromisso",
  "Atendimento direto com a equipe",
];

export const Budget = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 40, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 85%",
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
      // Sem padding embaixo: o respiro até o contato vem do topo da próxima seção.
      className="relative bg-gray-900 pt-[120px] max-md:pt-20"
    >
      <div className="mx-auto max-w-content max-[1359px]:px-4">
        <div
          ref={contentRef}
          className="relative isolate overflow-hidden rounded-3xl border border-white/[0.07] bg-gray-850 px-6 py-12 md:px-14 md:py-16"
        >
          {/* Grade de pontos que some nas bordas */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:22px_22px] [mask-image:radial-gradient(ellipse_70%_80%_at_80%_50%,black,transparent)]"
          />
          {/* Brilho só atrás do foguete, para não tingir a seção toda */}
          <div
            aria-hidden
            className="absolute -right-20 top-1/2 -z-10 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px]"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"
          />

          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
            <div
              ref={textRef}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
                Próximo passo
              </span>

              <h2 className="mb-5 text-4xl font-bold leading-tight text-white md:text-5xl">
                Pronto para transformar <br className="hidden lg:block" />
                seu negócio?
              </h2>

              <p className="mb-9 max-w-xl text-lg leading-relaxed text-gray-400">
                Conte sua ideia e receba um orçamento rápido, personalizado e
                sem compromisso.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <MagneticButton strength={0.2}>
                  <Button
                    href="#contact"
                    className="group gap-2 shadow-lg shadow-blue-500/25 transition-shadow duration-300 hover:shadow-blue-500/40"
                  >
                    Solicitar orçamento
                    <FiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </MagneticButton>
                <Button href="#portfolio" variant="soft" className="gap-2">
                  Ver projetos
                  <FiGrid className="h-4 w-4" />
                </Button>
              </div>

              <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400 md:justify-start">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FiCheck className="h-4 w-4 text-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pointer-events-none mx-auto w-[150px] max-md:-order-1 max-md:-mb-4 md:w-[260px] lg:w-[300px]">
              <LottieFromUrl src="/assets/lottie/rocket-launch.json" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
