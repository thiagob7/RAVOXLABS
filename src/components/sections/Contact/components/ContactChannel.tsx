"use client";

import Link from "next/link";
import { ReactNode, useState, useRef } from "react";
import { animated, useSpring } from "react-spring";
import gsap from "gsap";

interface ContactChannelProps {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  index?: number;
}

export const ContactChannel = ({
  icon,
  label,
  value,
  href,
  index = 0,
}: ContactChannelProps) => {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  const containerSpring = useSpring({
    transform: hovered ? "translateX(10px)" : "translateX(0px)",
    config: { tension: 300, friction: 20 },
  });

  const iconSpring = useSpring({
    transform: hovered ? "scale(1.1) rotate(5deg)" : "scale(1) rotate(0deg)",
    config: { tension: 400, friction: 15 },
  });

  const handleMouseEnter = () => {
    setHovered(true);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        boxShadow: "0 0 20px rgba(100, 103, 242, 0.4)",
        backgroundColor: "rgba(100, 103, 242, 0.2)",
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        boxShadow: "0 0 0px rgba(100, 103, 242, 0)",
        backgroundColor: "rgba(100, 103, 242, 0.1)",
        duration: 0.3,
      });
    }
  };

  return (
    <animated.div style={containerSpring}>
      <Link
        href={href}
        className="flex items-start gap-4 group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <animated.div
          ref={iconRef}
          style={iconSpring}
          className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 transition-colors duration-300"
        >
          <div className="text-blue-500">{icon}</div>
        </animated.div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-400">{label}</span>
          <span className="text-base text-white group-hover:text-blue-500 transition-colors duration-300">
            {value}
          </span>
        </div>
      </Link>
    </animated.div>
  );
};
