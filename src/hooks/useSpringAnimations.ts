"use client";

import { useSpring, useTrail, config, SpringValue } from "react-spring";
import { useRef, useEffect, useState } from "react";

// Hook for in-view detection
export function useInViewOnce(threshold: number = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}

// Counter animation hook
export function useCounterAnimation(
  end: number,
  duration: number = 2000,
  inView: boolean = true
): SpringValue<number> {
  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? end : 0,
    delay: 200,
    config: { duration },
  });

  return number;
}

// Fade in spring animation
export function useFadeInSpring(inView: boolean, delay: number = 0) {
  return useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(40px)",
    delay,
    config: config.gentle,
  });
}

// Scale spring animation
export function useScaleSpring(inView: boolean, delay: number = 0) {
  return useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "scale(1)" : "scale(0.9)",
    delay,
    config: config.wobbly,
  });
}

// Slide in spring animation
export function useSlideSpring(
  inView: boolean,
  direction: "left" | "right" | "up" | "down" = "up",
  delay: number = 0
) {
  const getTransform = (visible: boolean) => {
    if (visible) return "translate3d(0, 0, 0)";

    switch (direction) {
      case "left":
        return "translate3d(-100px, 0, 0)";
      case "right":
        return "translate3d(100px, 0, 0)";
      case "up":
        return "translate3d(0, 60px, 0)";
      case "down":
        return "translate3d(0, -60px, 0)";
    }
  };

  return useSpring({
    opacity: inView ? 1 : 0,
    transform: getTransform(inView),
    delay,
    config: config.gentle,
  });
}

// Trail animation for multiple items
export function useTrailAnimation<T>(
  items: T[],
  inView: boolean,
  options?: {
    delay?: number;
    from?: object;
    to?: object;
  }
) {
  return useTrail(items.length, {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(30px)",
    delay: options?.delay ?? 0,
    config: config.gentle,
    ...options?.from,
    ...(inView ? options?.to : {}),
  });
}

// Hover animation hook
export function useHoverSpring() {
  const [hovered, setHovered] = useState(false);

  const spring = useSpring({
    transform: hovered ? "scale(1.05)" : "scale(1)",
    boxShadow: hovered
      ? "0 20px 40px rgba(100, 103, 242, 0.2)"
      : "0 0px 0px rgba(100, 103, 242, 0)",
    config: config.wobbly,
  });

  return {
    spring,
    bind: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}

// Bounce animation
export function useBounceSpring(trigger: boolean) {
  return useSpring({
    transform: trigger ? "scale(1.1)" : "scale(1)",
    config: { tension: 300, friction: 10 },
  });
}

// Glow animation for cards
export function useGlowSpring(hovered: boolean) {
  return useSpring({
    boxShadow: hovered
      ? "0 0 30px rgba(100, 103, 242, 0.4), 0 0 60px rgba(100, 103, 242, 0.2)"
      : "0 0 0px rgba(100, 103, 242, 0)",
    borderColor: hovered ? "rgba(100, 103, 242, 0.5)" : "rgba(39, 44, 53, 1)",
    config: config.gentle,
  });
}

// Magnetic effect hook
export function useMagneticEffect() {
  const ref = useRef<HTMLElement>(null);
  const [spring, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { mass: 1, tension: 350, friction: 40 },
  }));

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * 0.2;
      const deltaY = (e.clientY - centerY) * 0.2;

      api.start({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      api.start({ x: 0, y: 0 });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [api]);

  return { ref, spring };
}
