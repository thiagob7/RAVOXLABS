"use client";

import Link from "next/link";
import { useRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";

import type {
  AnimatedIcon,
  AnimatedIconHandle,
} from "@/components/ui/animated-icon";

interface ContactChannelProps {
  icon: AnimatedIcon;
  label: string;
  value: string;
  href: string;
}

export const ContactChannel = ({
  icon: Icon,
  label,
  value,
  href,
}: ContactChannelProps) => {
  const iconRef = useRef<AnimatedIconHandle>(null);

  return (
    <Link
      href={href}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-gray-850 p-4 transition-colors duration-300 hover:border-white/[0.12] hover:bg-white/[0.02]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-blue-500">
        <Icon ref={iconRef} size={22} />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
          {label}
        </span>
        <span className="mt-0.5 truncate text-base font-medium text-gray-100">
          {value}
        </span>
      </span>

      <FiArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-100" />
    </Link>
  );
};
