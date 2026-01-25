"use client";

import { ReactNode, useState, useRef } from "react";
import { animated, useSpring } from "react-spring";
import gsap from "gsap";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index?: number;
}

export const ServiceCard = ({ icon, title, description, index = 0 }: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const cardSpring = useSpring({
    transform: hovered
      ? "scale(1.03) translateY(-10px)"
      : "scale(1) translateY(0px)",
    boxShadow: hovered
      ? "0 25px 50px rgba(100, 103, 242, 0.2), 0 0 80px rgba(100, 103, 242, 0.1)"
      : "0 0 0 rgba(100, 103, 242, 0)",
    config: { tension: 300, friction: 20 },
  });

  const iconSpring = useSpring({
    transform: hovered ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)",
    config: { tension: 400, friction: 15 },
  });

  const handleMouseEnter = () => {
    setHovered(true);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        boxShadow: "0 0 30px rgba(100, 103, 242, 0.5)",
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        boxShadow: "0 0 0px rgba(100, 103, 242, 0)",
        duration: 0.3,
      });
    }
  };

  return (
    <animated.div
      style={cardSpring}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-850 border border-gray-600 hover:border-[#6467F2]/70 transition-colors duration-300 cursor-pointer will-change-transform"
    >
      <animated.div
        ref={iconRef}
        style={iconSpring}
        className="text-blue-500 bg-blue-500/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center transition-colors duration-300"
      >
        {icon}
      </animated.div>
      <h3 className="text-xl font-semibold text-gray-100 mt-6">{title}</h3>
      <span className="text-gray-400 leading-relaxed mt-3">{description}</span>

      {/* Decorative line */}
      <div
        className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-6 transition-all duration-500"
        style={{ width: hovered ? "60%" : "0%" }}
      />
    </animated.div>
  );
};
