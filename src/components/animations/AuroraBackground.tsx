"use client";

import { useRef, useEffect, useCallback } from "react";

interface AuroraBackgroundProps {
  className?: string;
  colors?: string[];
  speed?: number;
  blur?: number;
}

export function AuroraBackground({
  className = "",
  colors = [
    "rgba(100, 103, 242, 0.3)",
    "rgba(139, 92, 246, 0.2)",
    "rgba(79, 70, 229, 0.25)",
    "rgba(100, 103, 242, 0.15)",
  ],
  speed = 0.002,
  blur = 100,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const timeRef = useRef(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    timeRef.current += speed;
    const time = timeRef.current;
    const mouse = mouseRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create multiple aurora waves
    colors.forEach((color, i) => {
      ctx.beginPath();

      const baseY = canvas.height * (0.3 + i * 0.15);
      const amplitude = 50 + i * 20;
      const frequency = 0.003 + i * 0.001;
      const phaseOffset = i * 0.5;

      // Mouse influence
      let mouseInfluence = 0;
      if (mouse.active) {
        const mouseYNorm = mouse.y / canvas.height;
        mouseInfluence = (mouseYNorm - 0.5) * 100;
      }

      ctx.moveTo(0, baseY);

      for (let x = 0; x <= canvas.width; x += 5) {
        const xNorm = x / canvas.width;

        // Multiple sine waves combined
        let y = baseY;
        y += Math.sin(x * frequency + time + phaseOffset) * amplitude;
        y += Math.sin(x * frequency * 2 + time * 1.5 + phaseOffset) * (amplitude * 0.5);
        y += Math.sin(x * frequency * 0.5 + time * 0.5 + phaseOffset) * (amplitude * 0.3);

        // Mouse ripple effect
        if (mouse.active) {
          const dx = x - mouse.x;
          const dy = baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const ripple = Math.sin(dist * 0.02 - time * 5) * Math.max(0, 1 - dist / 300) * 30;
          y += ripple;
        }

        ctx.lineTo(x, y);
      }

      // Complete the shape
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, canvas.height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color.replace(/[\d.]+\)$/, "0.1)"));
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.fill();
    });

    // Add subtle noise/grain effect
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 10;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    animationRef.current = requestAnimationFrame(animate);
  }, [colors, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block", filter: `blur(${blur}px)` }}
      />
    </div>
  );
}
