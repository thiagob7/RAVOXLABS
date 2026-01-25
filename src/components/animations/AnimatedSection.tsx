"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "scaleUp" | "slideLeft" | "slideRight";
  delay?: number;
  duration?: number;
  stagger?: boolean;
  as?: React.ElementType;
}

export function AnimatedSection({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  duration = 1,
  stagger = false,
  as: Component = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const targets = stagger ? element.children : element;

    const animations = {
      fadeUp: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0 },
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      scaleUp: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      slideLeft: {
        from: { opacity: 0, x: -100 },
        to: { opacity: 1, x: 0 },
      },
      slideRight: {
        from: { opacity: 0, x: 100 },
        to: { opacity: 1, x: 0 },
      },
    };

    const { from, to } = animations[animation];

    gsap.fromTo(targets, from, {
      ...to,
      duration,
      delay,
      stagger: stagger ? 0.15 : 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [animation, delay, duration, stagger]);

  return <Component ref={ref as React.LegacyRef<HTMLElement>} className={className}>{children}</Component>;
}
