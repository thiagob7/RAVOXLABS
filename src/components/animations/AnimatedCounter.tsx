"use client";

import { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  className = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  // Extract number and suffix (e.g., "50+" -> 50, "+")
  const numericMatch = value.match(/^(\d+)(.*)$/);
  const numericValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const suffix = numericMatch ? numericMatch[2] : value;

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

  const { number } = useSpring({
    from: { number: 0 },
    number: inView ? numericValue : 0,
    delay: 300,
    config: { duration },
  });

  return (
    <span ref={ref} className={className}>
      <animated.span>
        {number.to((n) => Math.floor(n))}
      </animated.span>
      {suffix}
    </span>
  );
}
