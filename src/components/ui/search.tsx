"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useImperativeHandle } from "react";

import { cn } from "@/lib/utils";

export interface SearchIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SearchIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

// Lupa "procurando": dá uma volta curta e volta ao lugar.
const SearchIcon = forwardRef<SearchIconHandle, SearchIconProps>(
  ({ className, size = 28, ...props }, ref) => {
    const controls = useAnimation();

    useImperativeHandle(ref, () => ({
      startAnimation: () =>
        controls.start({
          x: [0, 0, -3, 0],
          y: [0, -4, 0, 0],
          transition: { duration: 1, bounce: 0.3 },
        }),
      stopAnimation: () => controls.start({ x: 0, y: 0 }),
    }));

    return (
      <div className={cn(className)} {...props}>
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </motion.svg>
      </div>
    );
  }
);

SearchIcon.displayName = "SearchIcon";

export { SearchIcon };
