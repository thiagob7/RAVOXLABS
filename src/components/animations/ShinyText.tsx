"use client";

import { ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
  /** Cor do texto por baixo do brilho. */
  baseColor?: string;
  /** Cor do brilho que passa pelo texto. */
  shineColor?: string;
  /** Tempo de uma passada do brilho, em segundos. */
  duration?: number;
}

export function ShinyText({
  children,
  className = "",
  baseColor = "#ffffff",
  shineColor = "rgba(164, 168, 252, 0.85)",
  duration = 6,
}: ShinyTextProps) {
  return (
    <span
      className={`animate-shine bg-clip-text text-transparent ${className}`}
      style={{
        background: `radial-gradient(circle at center, ${shineColor}, transparent) -200% 50% / 200% 100% no-repeat, ${baseColor}`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
}
