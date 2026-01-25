"use client";

import { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade up animation on scroll
export function useFadeUp<T extends HTMLElement>(
  options?: {
    delay?: number;
    duration?: number;
    y?: number;
    start?: string;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: options?.y ?? 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: options?.start ?? "top 85%",
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
  }, [options?.delay, options?.duration, options?.y, options?.start]);

  return ref;
}

// Stagger children animation
export function useStaggerChildren<T extends HTMLElement>(
  options?: {
    stagger?: number;
    duration?: number;
    y?: number;
    start?: string;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const children = element.children;

    gsap.fromTo(
      children,
      {
        opacity: 0,
        y: options?.y ?? 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: options?.duration ?? 0.8,
        stagger: options?.stagger ?? 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: options?.start ?? "top 80%",
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
  }, [options?.stagger, options?.duration, options?.y, options?.start]);

  return ref;
}

// Scale up animation
export function useScaleUp<T extends HTMLElement>(
  options?: {
    delay?: number;
    duration?: number;
    scale?: number;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        scale: options?.scale ?? 0.8,
      },
      {
        opacity: 1,
        scale: 1,
        duration: options?.duration ?? 0.8,
        delay: options?.delay ?? 0,
        ease: "back.out(1.7)",
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
  }, [options?.delay, options?.duration, options?.scale]);

  return ref;
}

// Parallax effect
export function useParallax<T extends HTMLElement>(
  speed: number = 0.5
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      yPercent: -30 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return ref;
}

// Text reveal animation (split by words)
export function useTextReveal<T extends HTMLElement>(
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const text = element.innerText;
    const words = text.split(" ");

    element.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}</span></span>`
      )
      .join(" ");

    const spans = element.querySelectorAll("span > span");

    gsap.to(spans, {
      y: 0,
      duration: options?.duration ?? 0.8,
      stagger: options?.stagger ?? 0.05,
      delay: options?.delay ?? 0,
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
  }, [options?.delay, options?.duration, options?.stagger]);

  return ref;
}

// Horizontal slide animation
export function useSlideIn<T extends HTMLElement>(
  direction: "left" | "right" = "left",
  options?: {
    delay?: number;
    duration?: number;
    distance?: number;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const x = direction === "left"
      ? -(options?.distance ?? 100)
      : (options?.distance ?? 100);

    gsap.fromTo(
      element,
      {
        opacity: 0,
        x,
      },
      {
        opacity: 1,
        x: 0,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
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
  }, [direction, options?.delay, options?.duration, options?.distance]);

  return ref;
}

// Rotate in animation
export function useRotateIn<T extends HTMLElement>(
  options?: {
    delay?: number;
    duration?: number;
    rotation?: number;
  }
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        opacity: 0,
        rotation: options?.rotation ?? -10,
        y: 30,
      },
      {
        opacity: 1,
        rotation: 0,
        y: 0,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
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
  }, [options?.delay, options?.duration, options?.rotation]);

  return ref;
}
