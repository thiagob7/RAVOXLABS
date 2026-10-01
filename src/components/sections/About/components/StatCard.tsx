"use client";

import { useRef, useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { useSpring, animated } from "react-spring";

import { cn } from "@/lib/utils";

interface StatCardProps {
  number: string;
  title: string;
  icon: IconType;
  className?: string;
  index?: number;
}

export const StatCard = ({
  number,
  title,
  icon: Icon,
  className,
  index = 0,
}: StatCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Extract number and suffix (e.g., "50+" -> 50, "+")
  const numericMatch = number.match(/^(\d+)(.*)$/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const suffix = numericMatch ? numericMatch[2] : number;

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  const { animatedNumber } = useSpring({
    from: { animatedNumber: 0 },
    animatedNumber: inView ? numericValue : 0,
    delay: 300 + index * 200,
    config: { duration: 2000 },
  });

  return (
    <div
      ref={ref}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.01] p-6 transition-colors duration-300 hover:border-blue-500/30",
        className
      )}
    >
      <span className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      <Icon className="relative h-5 w-5 text-blue-500" />

      <div className="relative mt-8">
        <span className="block text-4xl font-bold tracking-tight text-white md:text-5xl">
          <animated.span>
            {animatedNumber.to((n) => Math.floor(n))}
          </animated.span>
          <span className="text-blue-500">{suffix}</span>
        </span>
        <span className="mt-2 block text-sm font-medium text-gray-400">
          {title}
        </span>
      </div>
    </div>
  );
};
