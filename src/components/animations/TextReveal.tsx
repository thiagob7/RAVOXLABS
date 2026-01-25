"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  splitBy?: "words" | "chars" | "lines";
}

export function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.03,
  splitBy = "words",
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const text = element.innerText;

    let parts: string[] = [];
    switch (splitBy) {
      case "chars":
        parts = text.split("");
        break;
      case "lines":
        parts = text.split("\n");
        break;
      case "words":
      default:
        parts = text.split(" ");
    }

    const separator = splitBy === "words" ? " " : "";

    element.innerHTML = parts
      .map(
        (part) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block" style="transform: translateY(100%); opacity: 0;">${part === " " ? "&nbsp;" : part}</span></span>`
      )
      .join(separator);

    const innerSpans = element.querySelectorAll("span > span");

    gsap.to(innerSpans, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
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
  }, [delay, stagger, splitBy, children]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
