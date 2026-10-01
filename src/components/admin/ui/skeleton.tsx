import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  style?: React.CSSProperties;
};

function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-gray-700/70", className)}
      style={style}
    />
  );
}

export { Skeleton };
