"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LottieFromUrl } from "@/components/animations/LottieFromUrl";
import { MailCheckIcon } from "@/components/ui/mail-check";
import { PhoneIcon } from "@/components/ui/phone";

import { ContactChannel } from "./components/ContactChannel";
import { ContactForm } from "./components/ContactForm";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const contactData = {
  eyebrow: "FALE CONOSCO",
  title: "Entre em contato",
  subtitle:
    "Estamos prontos para ouvir suas ideias e transformá-las em realidade.",
  left: {
    title: "Vamos conversar?",
    description:
      "Preencha o formulário ou entre em contato diretamente pelos canais abaixo. Responderemos em até 24 horas.",
    channels: [
      {
        type: "email",
        label: "Email",
        value: "contato@ravoxlabs.com",
        href: "mailto:contato@ravoxlabs.com",
        icon: MailCheckIcon,
      },
      {
        type: "phone",
        label: "Telefone",
        value: "(71) 99244-6022",
        href: "tel:+5571992446022",
        icon: PhoneIcon,
      },
    ],
  },
};

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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

      // Left column animation - slide from left
      if (leftRef.current) {
        gsap.fromTo(
          leftRef.current,
          { opacity: 0, x: -60 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Stagger children inside left column
        gsap.fromTo(
          leftRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Right column animation - slide from right with scale
      if (rightRef.current) {
        gsap.fromTo(
          rightRef.current,
          { opacity: 0, x: 60, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
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
      id="contact"
      className="relative bg-gray-900 py-[120px] overflow-hidden"
    >
      {/* Background decorations */}
      {/* Afastados das bordas: colados nelas, o overflow corta o blur numa linha reta. */}
      <div className="pointer-events-none absolute top-[20%] -right-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-[10%] -left-40 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-[1359px]:px-4 max-w-content relative z-10">
        <div className="flex items-center justify-between gap-8">
          <div ref={headerRef} className="flex flex-col">
            <span className="mb-4 block text-sm font-medium uppercase tracking-wider text-blue-500">
              {contactData.eyebrow}
            </span>
            <h2 className="text-4xl font-bold text-white">
              {contactData.title}
            </h2>
            <span className="mt-4 block max-w-2xl text-lg text-gray-400">
              {contactData.subtitle}
            </span>
          </div>

          <div className="reveal-lottie pointer-events-none -my-8 w-[150px] shrink-0 max-md:hidden lg:w-[180px]">
            <LottieFromUrl src="/assets/lottie/chat-bubbles.json" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">
          <div ref={leftRef} className="flex flex-col max-w-[442px]">
            <span className="text-2xl font-bold text-white">
              {contactData.left.title}
            </span>
            <span className="text-base leading-relaxed mt-6 text-gray-400">
              {contactData.left.description}
            </span>

            <div className="mt-8 flex flex-col gap-3">
              {contactData.left.channels.map((channel) => (
                <ContactChannel
                  key={channel.type}
                  icon={channel.icon}
                  label={channel.label}
                  value={channel.value}
                  href={channel.href}
                />
              ))}
            </div>
          </div>

          <div
            ref={rightRef}
            className="relative rounded-xl border border-white/[0.06] bg-gray-850 p-6 md:p-8"
          >
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
