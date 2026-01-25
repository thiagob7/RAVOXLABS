"use client";

import { ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

export function ShinyText({ children, className = "" }: ShinyTextProps) {
  return (
    <span
      className={`animate-shine bg-clip-text text-transparent ${className}`}
      style={{
        background: `radial-gradient(circle at center, rgba(164, 168, 252, 0.85), transparent) -200% 50% / 200% 100% no-repeat, #ffffff`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
}
