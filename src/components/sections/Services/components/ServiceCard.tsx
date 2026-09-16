"use client";

import Link from "next/link";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useRef,
  useState,
} from "react";
import { FiArrowRight } from "react-icons/fi";
import { animated, useSpring } from "react-spring";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export type AnimatedIcon = ForwardRefExoticComponent<
  { size?: number; className?: string } & RefAttributes<AnimatedIconHandle>
>;

interface ServiceCardProps {
  icon: AnimatedIcon;
  title: string;
  description: string;
  href: string;
  index: number;
}

const AnimatedLink = animated(Link);

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  href,
  index,
}: ServiceCardProps) => {
  const [hovered, setHovered] = useState(false);
  const iconRef = useRef<AnimatedIconHandle>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    iconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    iconRef.current?.stopAnimation();
  };

  const cardSpring = useSpring({
    transform: hovered ? "translateY(-4px)" : "translateY(0px)",
    config: { tension: 280, friction: 26 },
  });

  return (
    <AnimatedLink
      href={href}
      style={cardSpring}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gray-850 p-7 transition-colors duration-300 will-change-transform hover:border-white/[0.12]"
    >
      {/* Top edge highlight */}
      <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-gray-400 transition-colors duration-300 group-hover:text-blue-500">
          <Icon ref={iconRef} size={22} />
        </div>
        <span className="font-mono text-xs tracking-wider text-gray-400/50">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-8 text-lg font-semibold text-gray-100">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-gray-400">
        {description}
      </p>

      <span className="mt-auto flex items-center gap-1.5 pt-8 text-sm font-medium text-gray-400 transition-colors duration-300 group-hover:text-gray-100">
        Saiba mais
        <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </AnimatedLink>
  );
};
