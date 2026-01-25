"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";

import { InteractiveParticles } from "../../animations/InteractiveParticles";
import { MagneticButton } from "../../animations/MagneticButton";
import { Button } from "../../ui/Button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Banner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

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

      // Text glow pulse animation
      gsap.to(".text-blue-glow", {
        textShadow: "0 0 40px rgba(100, 103, 242, 0.6)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden pt-16"
    >
      {/* Background image with parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-banner bg-left bg-no-repeat bg-cover will-change-transform opacity-40"
      />

      {/* Interactive particles with lines - react to mouse */}
      <InteractiveParticles
        className="z-[5]"
        particleCount={70}
        color="100, 103, 242"
        lineColor="100, 103, 242"
        maxDistance={120}
        mouseRadius={150}
        mouseForce={10}
      />

      {/* Static ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/8 rounded-full blur-[100px] pointer-events-none z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none z-[1]" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/20 to-gray-900 z-[3] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-transparent to-gray-900/60 z-[3] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 103, 242, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 103, 242, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="flex flex-col relative z-10 mx-auto text-center max-[1359px]:px-4 max-w-content">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center mx-auto gap-2 px-4 py-2 rounded-full bg-gray-650/80 backdrop-blur-md border border-gray-600 hover:border-blue-500/50 transition-all duration-300"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-white text-sm font-medium">
            Soluções digitais para pequenos negócios
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-[60px] max-md:text-[32px] font-bold text-white leading-tight mx-auto mt-8 perspective-1000"
        >
          <span className="heading-line block">
            Tecnologia e design acessíveis para
          </span>
          <span className="heading-line block">
            <span className="text-blue-500 text-blue-glow inline-block">
              pequenos negócios.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <span
          ref={subtitleRef}
          className="text-lg text-gray-400 mb-10 max-w-2xl max-md:text-sm mx-auto leading-relaxed mt-6"
        >
          Criamos sites, sistemas e interfaces modernas para autônomos e
          pequenas empresas que querem se posicionar digitalmente.
        </span>

        {/* Buttons */}
        <div
          ref={buttonsRef}
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
        >
          <MagneticButton strength={0.2}>
            <Button
              href="#get-started"
              className="flex-1 gap-2 group max-w-[212px] w-full hover:shadow-lg hover:shadow-blue-500/25 transition-shadow duration-300"
            >
              Começar agora
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </MagneticButton>

          <MagneticButton strength={0.2}>
            <Button
              href="#services"
              variant="outline"
              className="flex-1 max-w-[212px] w-full transition-colors duration-300"
            >
              Nossos serviços
            </Button>
          </MagneticButton>
        </div>
      </div>

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
