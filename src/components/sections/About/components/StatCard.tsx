"use client";

import { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

interface StatCardProps {
  number: string;
  title: string;
  className?: string;
  index?: number;
}

export const StatCard = ({ number, title, className, index = 0 }: StatCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const hoverSpring = useSpring({
    transform: hovered ? "scale(1.05) translateY(-5px)" : "scale(1) translateY(0px)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      ref={ref}
      style={hoverSpring}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col items-center text-center p-6 rounded-2xl bg-gray-850/50 backdrop-blur-sm border border-gray-600/50 hover:border-blue-500/50 transition-colors duration-300 cursor-default ${className || ""}`}
    >
      <span className="text-5xl font-bold text-[#6467F2] mb-2">
        <animated.span>
          {animatedNumber.to((n) => Math.floor(n))}
        </animated.span>
        {suffix}
      </span>
      <span className="text-sm text-white font-medium">{title}</span>
    </animated.div>
  );
};
