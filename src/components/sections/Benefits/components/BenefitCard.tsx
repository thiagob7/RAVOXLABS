"use client";

import { useState, useRef } from "react";
import { animated, useSpring } from "react-spring";
import gsap from "gsap";

import type {
  AnimatedIcon,
  AnimatedIconHandle,
} from "@/components/ui/animated-icon";

interface BenefitCardProps {
  icon: AnimatedIcon;
  title: string;
  description: string;
  /** Número exibido no canto, só como apoio visual. */
  index: number;
}

export const BenefitCard = ({
  icon: Icon,
  title,
  description,
  index,
}: BenefitCardProps) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const animatedIconRef = useRef<AnimatedIconHandle>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const cardSpring = useSpring({
    transform: hovered ? "translateY(-4px)" : "translateY(0px)",
    boxShadow: hovered
      ? "0 10px 24px rgba(0, 0, 0, 0.25)"
      : "0 0px 0px rgba(0, 0, 0, 0)",
    config: { tension: 280, friction: 26 },
  });

  const iconSpring = useSpring({
    transform: hovered ? "scale(1.05) rotate(-3deg)" : "scale(1) rotate(0deg)",
    config: { tension: 400, friction: 15 },
  });

  const handleMouseEnter = () => {
    setHovered(true);
    animatedIconRef.current?.startAnimation();
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        duration: 0.3,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.5,
        scale: 1,
        duration: 0.4,
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    animatedIconRef.current?.stopAnimation();
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        duration: 0.3,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
      });
    }
  };

  return (
    <animated.div
      ref={cardRef}
      style={cardSpring}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col items-start overflow-hidden rounded-2xl border border-gray-600 bg-gray-900 p-6 text-start transition-colors duration-300 hover:border-blue-500/25"
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-0 scale-75 pointer-events-none"
      />

      <div className="flex w-full items-start justify-between">
        <animated.div
          ref={iconRef}
          style={iconSpring}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03] text-blue-500"
        >
          <Icon ref={animatedIconRef} size={24} />
        </animated.div>

        <span
          aria-hidden
          className="font-mono text-sm tabular-nums text-gray-600 transition-colors duration-300 group-hover:text-gray-400"
        >
          {String(index).padStart(2, "0")}
        </span>
      </div>

      <h3 className="text-xl font-semibold text-gray-100 mt-6">{title}</h3>
      <span className="text-gray-400 leading-relaxed mt-2">{description}</span>

      {/* Bottom border animation */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
        style={{ width: hovered ? "100%" : "0%" }}
      />
    </animated.div>
  );
};
