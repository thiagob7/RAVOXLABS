import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export type AnimatedIcon = ForwardRefExoticComponent<
  { size?: number; className?: string } & RefAttributes<AnimatedIconHandle>
>;
