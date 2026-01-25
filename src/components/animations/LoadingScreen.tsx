"use client";

import { useEffect, useState, useRef } from "react";
import { animated, useSpring } from "react-spring";
import Image from "next/image";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  const containerSpring = useSpring({
    opacity: isExiting ? 0 : 1,
    transform: isExiting ? "scale(1.05)" : "scale(1)",
    config: { tension: 280, friction: 25 },
  });

  const logoSpring = useSpring({
    from: { opacity: 0, scale: 0.8, y: 20 },
    to: { opacity: 1, scale: 1, y: 0 },
    config: { tension: 200, friction: 20 },
  });

  const progressSpring = useSpring({
    width: `${progress}%`,
    config: { tension: 120, friction: 14 },
  });

  useEffect(() => {
    const duration = 1200; // Faster loading
    const startTime = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // Smooth ease-out
      const rawProgress = Math.min(elapsed / duration, 1);
      const newProgress = easeOut(rawProgress) * 100;

      setProgress(newProgress);

      if (rawProgress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        // Start exit animation
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 300);
        }, 150);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onLoadingComplete]);

  if (isExiting && progress >= 100) {
    return (
      <animated.div
        style={containerSpring}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900"
      />
    );
  }

  return (
    <animated.div
      style={containerSpring}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Logo */}
      <animated.div
        ref={logoRef}
        style={{
          opacity: logoSpring.opacity,
          transform: logoSpring.scale.to((s) => `scale(${s}) translateY(${logoSpring.y.get()}px)`),
        }}
        className="relative z-10 mb-8"
      >
        <Image
          src="/assets/img/Logo.png"
          alt="RAVOX Labs"
          width={200}
          height={60}
          priority
          className="h-auto w-[180px] md:w-[220px]"
        />
      </animated.div>

      {/* Progress bar */}
      <div className="relative z-10 w-48 md:w-56">
        <div className="h-[3px] bg-gray-800 rounded-full overflow-hidden">
          <animated.div
            style={{ width: progressSpring.width }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
          />
        </div>
        <div className="flex justify-center mt-3">
          <span className="text-xs text-gray-500 tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
    </animated.div>
  );
}
