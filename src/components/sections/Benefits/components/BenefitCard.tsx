"use client";

import { ReactNode, useState, useRef, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import gsap from "gsap";

interface BenefitCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export const BenefitCard = ({ icon, title, description, index = 0 }: BenefitCardProps) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const cardSpring = useSpring({
    transform: hovered
      ? "scale(1.02) translateY(-8px)"
      : "scale(1) translateY(0px)",
    boxShadow: hovered
      ? "0 20px 40px rgba(100, 103, 242, 0.15)"
      : "0 0 0 rgba(100, 103, 242, 0)",
    config: { tension: 300, friction: 20 },
  });

  const iconSpring = useSpring({
    transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
    config: { tension: 400, friction: 15 },
  });

  const handleMouseEnter = () => {
    setHovered(true);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        backgroundColor: "rgba(100, 103, 242, 0.2)",
        duration: 0.3,
      });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        backgroundColor: "rgba(100, 103, 242, 0.1)",
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
      className="relative flex flex-col items-start text-start p-6 rounded-2xl bg-gray-900 border border-gray-600 hover:border-blue-500/50 transition-colors duration-300 cursor-pointer overflow-hidden"
    >
      {/* Glow effect */}
      <div
        ref={glowRef}
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl opacity-0 scale-75 pointer-events-none"
      />

      <animated.div
        ref={iconRef}
        style={iconSpring}
        className="text-blue-500 bg-blue-500/10 p-3 rounded-xl w-12 h-12 flex items-center justify-center transition-colors duration-300"
      >
        {icon}
      </animated.div>

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
