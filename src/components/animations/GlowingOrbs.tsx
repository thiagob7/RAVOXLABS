"use client";

import { useRef, useEffect, useCallback } from "react";

interface Orb {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  speed: number;
}

interface GlowingOrbsProps {
  className?: string;
  orbCount?: number;
  colors?: string[];
  mouseInfluence?: number;
}

export function GlowingOrbs({
  className = "",
  orbCount = 5,
  colors = [
    "rgba(100, 103, 242, 0.3)",
    "rgba(100, 103, 242, 0.2)",
    "rgba(139, 92, 246, 0.2)",
    "rgba(100, 103, 242, 0.15)",
    "rgba(79, 70, 229, 0.2)",
  ],
  mouseInfluence = 0.1,
}: GlowingOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>(0);

  const initOrbs = useCallback((width: number, height: number) => {
    const orbs: Orb[] = [];

    for (let i = 0; i < orbCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      orbs.push({
        x,
        y,
        targetX: x,
        targetY: y,
        size: Math.random() * 300 + 200,
        color: colors[i % colors.length],
        speed: 0.02 + Math.random() * 0.02,
      });
    }

    return orbs;
  }, [orbCount, colors]);

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs = orbsRef.current;
    const mouse = mouseRef.current;
    const rect = container.getBoundingClientRect();

    orbs.forEach((orb, i) => {
      // Random movement
      if (Math.random() < 0.01) {
        orb.targetX = Math.random() * rect.width;
        orb.targetY = Math.random() * rect.height;
      }

      // Mouse influence
      const dx = mouse.x - orb.x;
      const dy = mouse.y - orb.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 300) {
        orb.targetX += dx * mouseInfluence;
        orb.targetY += dy * mouseInfluence;
      }

      // Move towards target
      orb.x += (orb.targetX - orb.x) * orb.speed;
      orb.y += (orb.targetY - orb.y) * orb.speed;

      // Update DOM element
      const element = container.children[i] as HTMLElement;
      if (element) {
        element.style.transform = `translate(${orb.x - orb.size / 2}px, ${orb.y - orb.size / 2}px)`;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [mouseInfluence]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    orbsRef.current = initOrbs(rect.width, rect.height);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    container.addEventListener("mousemove", handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initOrbs]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbsRef.current.length === 0 &&
        Array.from({ length: orbCount }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl transition-transform duration-1000 ease-out"
            style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              backgroundColor: colors[i % colors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      {orbsRef.current.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            backgroundColor: orb.color,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
