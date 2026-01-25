"use client";

import { useState, ReactNode, useRef, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  index?: number;
}

export function GlowCard({
  children,
  className = "",
  glowColor = "rgba(100, 103, 242, 0.4)",
  index = 0,
}: GlowCardProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const spring = useSpring({
    transform: hovered ? "scale(1.02) translateY(-5px)" : "scale(1) translateY(0px)",
    boxShadow: hovered
      ? `0 20px 40px ${glowColor}, 0 0 60px ${glowColor.replace("0.4", "0.2")}`
      : "0 0 0px rgba(100, 103, 242, 0)",
    config: { tension: 300, friction: 20 },
  });

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [index]);

  return (
    <animated.div
      ref={ref}
      style={spring}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </animated.div>
  );
}
