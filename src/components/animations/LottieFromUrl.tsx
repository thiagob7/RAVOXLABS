"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface LottieFromUrlProps {
  src: string;
  className?: string;
  loop?: boolean;
}

/** Carrega o JSON do Lottie sob demanda para não pesar no bundle. */
export function LottieFromUrl({
  src,
  className,
  loop = true,
}: LottieFromUrlProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(src)
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled) setAnimationData(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={cn("animate-[fade-in-up_0.8s_ease-out]", className)}
    />
  );
}
