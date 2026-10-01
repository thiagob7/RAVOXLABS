"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import { FiArrowRight, FiCheck } from "react-icons/fi";

import { GradientWaves } from "../../animations/GradientWaves";
import { LottieFromUrl } from "../../animations/LottieFromUrl";
import { MagneticButton } from "../../animations/MagneticButton";
import { ShinyText } from "../../animations/ShinyText";
import { Button } from "../../ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = ["Entrega ágil", "Suporte próximo", "Design sob medida"];

export const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLUListElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Initial animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      // Badge animation
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
      );

      // Heading animation - split by lines
      if (headingRef.current) {
        const lines = headingRef.current.querySelectorAll(".heading-line");
        tl.fromTo(
          lines,
          { opacity: 0, y: 60, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.4"
        );
      }

      // Subtitle animation
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // Buttons animation
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        tl.fromTo(
          buttons,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        );
      }

      // Highlights
      if (highlightsRef.current) {
        tl.fromTo(
          highlightsRef.current.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // Visual entra pela direita junto com o título
      tl.fromTo(
        visualRef.current,
        { opacity: 0, x: 60, scale: 0.92 },
        { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power3.out" },
        0.3
      );

      // Parallax background effect
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden pt-24"
    >
      {/* Ondas em gradiente (React Bits) na parte de baixo do hero */}
      <div
        ref={bgRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] will-change-transform [mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
      >
        {/* Horizonte escuro + ondas roxas com cristas claras: mantém o
            fundo escuro atrás do texto e deixa o relevo das ondas visível. */}
        <GradientWaves
          horizonColor="#15163F"
          waveColor="#2B2D8F"
          crestColor="#A5A7FF"
          amplitude={1.2}
          fogDepth={18}
          brightness={0.7}
          grainIntensity={0.03}
          mouseInteraction={false}
        />
      </div>

      {/* Emenda suave com a próxima seção */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-32 bg-gradient-to-b from-transparent to-gray-900"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid w-full max-w-content items-center gap-12 pb-24 pt-10 max-[1359px]:px-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-16">
        {/* Texto */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-650/80 backdrop-blur-md border border-gray-600 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-white text-sm font-medium">
              Soluções digitais para pequenos negócios
            </span>
          </div>

          {/* Heading */}
          <h1
            ref={headingRef}
            className="mt-7 text-[34px] font-bold leading-[1.1] tracking-tight text-white md:text-[48px] xl:text-[60px] perspective-1000"
          >
            <span className="heading-line block">Tecnologia e design</span>
            <span className="heading-line block">acessíveis para</span>
            <span className="heading-line block">
              <ShinyText
                baseColor="#6467F2"
                shineColor="rgba(214, 216, 255, 0.95)"
                // Folga embaixo para o background-clip não cortar o "g"
                className="inline-block pb-[0.15em] -mb-[0.15em]"
              >
                pequenos negócios.
              </ShinyText>
            </span>
          </h1>

          {/* Subtitle */}
          <span
            ref={subtitleRef}
            className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400 max-md:text-base"
          >
            Criamos sites, sistemas e interfaces modernas para autônomos e
            pequenas empresas que querem se posicionar digitalmente.
          </span>

          {/* Buttons */}
          <div
            ref={buttonsRef}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton strength={0.2}>
              <Button
                href="#get-started"
                className="gap-2 group hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300"
              >
                Começar agora
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </MagneticButton>

            <MagneticButton strength={0.2}>
              <Button
                href="#services"
                variant="soft"
                className="transition-colors duration-300"
              >
                Nossos serviços
              </Button>
            </MagneticButton>
          </div>

          {/* Diferenciais rápidos */}
          <ul
            ref={highlightsRef}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-300 lg:justify-start"
          >
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/15 text-blue-500">
                  <FiCheck className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: notebook 3D montando um site (Lottie) */}
        <div
          ref={visualRef}
          aria-hidden
          className="pointer-events-none relative mx-auto w-full max-w-[420px] sm:max-w-[540px] lg:max-w-[640px]"
        >
          <div className="absolute inset-x-[12%] inset-y-[8%] rounded-full bg-blue-500/25 blur-[90px]" />
          <LottieFromUrl
            src="/assets/lottie/website-development-3d.json"
            className="relative w-full"
          />
        </div>
      </div>

      {/* TODO: astronauta desativado por enquanto; para reativar, descomente.
      {/ * Space boy developer sitting on the bottom edge * /}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] max-md:hidden">
        {/ * Mesmo container do header, para alinhar com a logo * /}
        <div className="mx-auto max-w-content max-[1359px]:px-4">
          {/ * A animação tem margem interna: 14,8% à esquerda e 10% embaixo.
              Deslocar exatamente isso encosta a base do astronauta na borda. * /}
          <div className="w-[220px] -translate-x-[15%] translate-y-[10%] lg:w-[280px]">
            <LottieFromUrl src="/assets/lottie/space-boy-developer.json" />
          </div>
        </div>
      </div>
      */}

      {/* Scroll indicator - Mouse */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <a
          href="#about"
          className="flex flex-col items-center gap-2 group cursor-pointer"
        >
          {/* Mouse outline */}
          <div className="w-6 h-10 rounded-full border-2 border-gray-400/60 flex justify-center pt-2 group-hover:border-blue-500/80 transition-colors duration-300">
            {/* Scroll wheel - animated */}
            <div className="w-1 h-2 bg-gray-400/80 rounded-full animate-scroll-wheel group-hover:bg-blue-500 transition-colors duration-300" />
          </div>
          {/* Arrow down */}
          <svg
            className="w-5 h-5 text-gray-400/60 animate-bounce-slow group-hover:text-blue-500/80 transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};
