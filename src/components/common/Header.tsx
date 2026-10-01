"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { animated, useSpring, useSprings } from "react-spring";

import { GooeyNav } from "@/components/animations/GooeyNav";
import { gsap } from "@/lib/gsap";

import { Button } from "../ui/Button";
import { Logo } from "./Logo";

// Navigation links
const navLinks = [
  { href: "#home", label: "Início" },
  { href: "#about", label: "Sobre" },
  { href: "#services", label: "Serviços" },
  { href: "#benefits", label: "Diferenciais" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#contact", label: "Contato" },
];

// Seções da home, na ordem da página, e o item do nav que cada uma acende.
// O orçamento (#get-started) fica sob "Contato".
const homeSections: { id: string; nav: number }[] = [
  { id: "home", nav: 0 },
  { id: "about", nav: 1 },
  { id: "services", nav: 2 },
  { id: "benefits", nav: 3 },
  { id: "portfolio", nav: 4 },
  { id: "get-started", nav: 5 },
  { id: "contact", nav: 5 },
];

// Nas outras páginas, o item vem da rota.
function navIndexForPath(pathname: string) {
  if (pathname.startsWith("/about")) return 1;
  if (pathname.startsWith("/services")) return 2;
  if (pathname.startsWith("/projetos")) return 4;
  if (pathname.startsWith("/contact")) return 5;
  return -1;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollIndex, setScrollIndex] = useState(0);
  const activeIndex = isHome ? scrollIndex : navIndexForPath(pathname);
  const headerRef = useRef<HTMLDivElement>(null);
  // Pausa o scroll spy enquanto o gsap rola até a seção clicada.
  const autoScrolling = useRef(false);
  const scrollTween = useRef<gsap.core.Tween | null>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy: acende a última seção cujo topo já passou de ~45% da tela,
  // assim sempre há um item marcado (inclusive entre seções).
  useEffect(() => {
    if (!isHome) return;
    const sections = homeSections
      .map(({ id, nav }) => ({ el: document.getElementById(id), nav }))
      .filter((s): s is { el: HTMLElement; nav: number } => Boolean(s.el));
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (autoScrolling.current) return;
      const line = window.innerHeight * 0.45;
      let index = sections[0].nav;
      for (const { el, nav } of sections) {
        if (el.getBoundingClientRect().top <= line) index = nav;
      }
      // No fim da página a última seção pode não alcançar a linha.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (atBottom) index = sections[sections.length - 1].nav;
      setScrollIndex(index);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  // Initial animation
  useEffect(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  // Floating bar spring animation
  const headerSpring = useSpring({
    backgroundColor: scrolled
      ? "rgba(17, 19, 23, 0.82)"
      : "rgba(17, 19, 23, 0.55)",
    borderColor: scrolled
      ? "rgba(100, 103, 242, 0.25)"
      : "rgba(255, 255, 255, 0.08)",
    boxShadow: scrolled
      ? "0 12px 40px rgba(0, 0, 0, 0.45)"
      : "0 4px 20px rgba(0, 0, 0, 0.2)",
    config: { tension: 200, friction: 20 },
  });

  // Mobile menu animation
  const mobileMenuSpring = useSpring({
    opacity: mobileMenuOpen ? 1 : 0,
    transform: mobileMenuOpen ? "translateY(0px)" : "translateY(-20px)",
    config: { tension: 300, friction: 25 },
  });

  // Staggered entrance for nav + CTA
  const trail = useSprings(
    2,
    [0, 1].map((index) => ({
      from: { opacity: 0, transform: "translateY(-10px)" },
      to: { opacity: 1, transform: "translateY(0px)" },
      delay: 500 + index * 100,
      config: { tension: 300, friction: 20 },
    }))
  );

  // Mobile menu stagger
  const mobileTrail = useSprings(
    navLinks.length + 1,
    Array.from({ length: navLinks.length + 1 }, (_, index) => ({
      opacity: mobileMenuOpen ? 1 : 0,
      transform: mobileMenuOpen ? "translateX(0px)" : "translateX(-20px)",
      delay: mobileMenuOpen ? index * 50 : 0,
      config: { tension: 300, friction: 25 },
    }))
  );

  const handleNavClick = (
    e: React.MouseEvent<HTMLElement>,
    href: string,
    index?: number
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (!element) {
      // Section lives on the home page (e.g. when browsing /projetos)
      window.location.href = `/${href}`;
      return;
    }
    if (index !== undefined) setScrollIndex(index);

    // O `scroll-behavior: smooth` do globals.css suaviza cada frame do gsap e
    // atrasa a rolagem; desliga enquanto o tween roda.
    const root = document.documentElement;
    const done = () => {
      root.style.scrollBehavior = "";
      autoScrolling.current = false;
    };
    scrollTween.current?.kill();
    root.style.scrollBehavior = "auto";
    autoScrolling.current = true;
    scrollTween.current = gsap.to(window, {
      duration: 0.9,
      scrollTo: { y: element, offsetY: 96, autoKill: true, onAutoKill: done },
      ease: "power3.inOut",
      overwrite: true,
      onComplete: done,
      onInterrupt: done,
    });
    setMobileMenuOpen(false);
  };

  return (
    <div ref={headerRef} className="fixed inset-x-0 top-3 z-50 px-4 md:top-4">
      <animated.header
        style={headerSpring}
        className="mx-auto max-w-content rounded-2xl border backdrop-blur-xl"
      >
        <div className="flex h-16 items-center justify-between pl-5 pr-3">
          <div className="flex items-center">
            <Logo />
          </div>

          <animated.div style={trail[0]} className="hidden lg:block">
            <GooeyNav
              items={navLinks}
              activeIndex={activeIndex}
              onItemClick={(e, item, index) =>
                handleNavClick(e, item.href, index)
              }
            />
          </animated.div>

          <animated.div
            style={trail[1]}
            className="hidden lg:flex items-center"
          >
            <Button
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact", 5)}
              className="h-[40px] hover:shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
            >
              Fale conosco
            </Button>
          </animated.div>

          <button
            className="lg:hidden p-2 text-white hover:text-blue-500 transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            <animated.div
              style={{
                transform: mobileMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              {mobileMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </animated.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <animated.div
          style={mobileMenuSpring}
          className={`flex flex-col lg:hidden border-t border-white/10 py-5 gap-6 items-center ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          {mobileTrail.slice(0, navLinks.length).map((style, index) => (
            <animated.div key={navLinks[index].href} style={style}>
              <Link
                href={navLinks[index].href}
                className={`transition-colors duration-300 hover:text-blue-500 ${
                  activeIndex === index
                    ? "text-white font-medium"
                    : "text-gray-100"
                }`}
                onClick={(e) => handleNavClick(e, navLinks[index].href, index)}
              >
                {navLinks[index].label}
              </Link>
            </animated.div>
          ))}

          <animated.div style={mobileTrail[navLinks.length]}>
            <Button
              href="#contact"
              className="h-[40px]"
              onClick={(e) => handleNavClick(e, "#contact", 5)}
            >
              Fale conosco
            </Button>
          </animated.div>
        </animated.div>
      </animated.header>
    </div>
  );
}
