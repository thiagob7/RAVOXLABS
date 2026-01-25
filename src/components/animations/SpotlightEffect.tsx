"use client";

import { useRef, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

interface SpotlightEffectProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
}

export function SpotlightEffect({
  className = "",
  size = 400,
  color = "rgba(100, 103, 242, 0.15)",
  blur = 80,
}: SpotlightEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const spring = useSpring({
    x: position.x - size / 2,
    y: position.y - size / 2,
    opacity: isVisible ? 1 : 0,
    config: { mass: 1, tension: 280, friction: 40 },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ pointerEvents: "auto" }}
    >
      <animated.div
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          transform: spring.x.to(
            (x) => `translate3d(${x}px, ${spring.y.get()}px, 0)`
          ),
          opacity: spring.opacity,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
