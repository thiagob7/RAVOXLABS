"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { animated, useSpring, useTrail } from "react-spring";
import { gsap } from "@/lib/gsap";

import { Button } from "../ui/Button";
import { Logo } from "./Logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Header background spring animation
  const headerSpring = useSpring({
    backgroundColor: scrolled ? "rgba(8, 10, 12, 0.95)" : "rgba(8, 10, 12, 0.8)",
    backdropFilter: scrolled ? "blur(20px)" : "blur(12px)",
    borderBottomColor: scrolled ? "rgba(100, 103, 242, 0.2)" : "rgba(39, 44, 53, 1)",
    boxShadow: scrolled
      ? "0 4px 30px rgba(0, 0, 0, 0.3)"
      : "0 0 0 rgba(0, 0, 0, 0)",
    config: { tension: 200, friction: 20 },
  });

  // Mobile menu animation
  const mobileMenuSpring = useSpring({
    opacity: mobileMenuOpen ? 1 : 0,
    transform: mobileMenuOpen ? "translateY(0px)" : "translateY(-20px)",
    config: { tension: 300, friction: 25 },
  });

  // Navigation links
  const navLinks = [
    { href: "#about", label: "Sobre" },
    { href: "#services", label: "Serviços" },
    { href: "#contact", label: "Contato" },
  ];

  // Trail animation for nav links
  const trail = useTrail(navLinks.length, {
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(-10px)" },
    delay: 500,
    config: { tension: 300, friction: 20 },
  });

  // Mobile menu trail
  const mobileTrail = useTrail(navLinks.length + 1, {
    opacity: mobileMenuOpen ? 1 : 0,
    transform: mobileMenuOpen ? "translateX(0px)" : "translateX(-20px)",
    config: { tension: 300, friction: 25 },
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <animated.header
      ref={headerRef}
      style={headerSpring}
      className="fixed top-0 w-full border-b z-50"
    >
      <nav ref={navRef} className="max-w-content mx-auto max-[1359px]:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center justify-between gap-[31px]">
            {trail.map((style, index) => (
              <animated.div key={navLinks[index].href} style={style}>
                <Link
                  href={navLinks[index].href}
                  onClick={(e) => handleNavClick(e, navLinks[index].href)}
                  className="text-gray-100 hover:text-blue-500 transition-colors duration-300 relative group"
                >
                  {navLinks[index].label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              </animated.div>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <animated.div
              style={{
                opacity: trail[0]?.opacity,
                transform: trail[0]?.transform,
              }}
            >
              <Button
                href="#get-started"
                className="h-[40px] hover:shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
              >
                Fale conosco
              </Button>
            </animated.div>
          </div>

          <button
            className="md:hidden p-2 text-white hover:text-blue-500 transition-colors duration-300"
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
          className={`flex flex-col md:hidden py-4 gap-6 items-center ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          {mobileTrail.slice(0, navLinks.length).map((style, index) => (
            <animated.div key={navLinks[index].href} style={style}>
              <Link
                href={navLinks[index].href}
                className="text-gray-100 hover:text-blue-500 transition-colors duration-300"
                onClick={(e) => handleNavClick(e, navLinks[index].href)}
              >
                {navLinks[index].label}
              </Link>
            </animated.div>
          ))}

          <animated.div style={mobileTrail[navLinks.length]}>
            <Button
              href="#get-started"
              className="h-[40px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fale conosco
            </Button>
          </animated.div>
        </animated.div>
      </nav>
    </animated.header>
  );
}
