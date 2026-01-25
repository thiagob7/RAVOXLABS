"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className = "",
  amplitude = 15,
  duration = 3,
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      y: amplitude,
      duration,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [amplitude, duration]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
