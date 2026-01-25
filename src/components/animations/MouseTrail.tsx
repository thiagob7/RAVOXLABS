"use client";

import { useRef, useEffect, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface MouseTrailProps {
  className?: string;
  particleCount?: number;
  color?: string;
  maxSize?: number;
  fadeSpeed?: number;
}

export function MouseTrail({
  className = "",
  particleCount = 30,
  color = "100, 103, 242",
  maxSize = 6,
  fadeSpeed = 0.02,
}: MouseTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, prevX: -100, prevY: -100, isMoving: false });
  const animationRef = useRef<number>(0);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Calculate mouse velocity
    const vx = mouse.x - mouse.prevX;
    const vy = mouse.y - mouse.prevY;
    const speed = Math.sqrt(vx * vx + vy * vy);

    // Add new particles at mouse position if mouse moved
    if (speed > 2 && mouse.x > 0 && mouse.y > 0) {
      const numParticles = Math.min(Math.floor(speed / 5) + 1, 5);
      for (let i = 0; i < numParticles; i++) {
        if (particles.length < particleCount * 4) {
          const angle = Math.random() * Math.PI * 2;
          const particleSpeed = Math.random() * 3 + 1;
          const offsetX = (Math.random() - 0.5) * 30;
          const offsetY = (Math.random() - 0.5) * 30;

          particles.push({
            x: mouse.x + offsetX,
            y: mouse.y + offsetY,
            vx: Math.cos(angle) * particleSpeed - vx * 0.2,
            vy: Math.sin(angle) * particleSpeed - vy * 0.2,
            life: 1,
            maxLife: 1,
            size: Math.random() * maxSize + 2,
          });
        }
      }
    }

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.05; // Slight gravity
      p.life -= fadeSpeed;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      const alpha = p.life * 0.9;
      const size = p.size * (0.5 + p.life * 0.5);

      // Outer glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
      gradient.addColorStop(0, `rgba(${color}, ${alpha * 0.8})`);
      gradient.addColorStop(0.4, `rgba(${color}, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core bright spot
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
      ctx.fill();
    }

    // Draw mouse glow when stationary
    if (mouse.x > 0 && mouse.y > 0) {
      const glowGradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 100
      );
      glowGradient.addColorStop(0, `rgba(${color}, 0.15)`);
      glowGradient.addColorStop(0.5, `rgba(${color}, 0.05)`);
      glowGradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [color, fadeSpeed, maxSize, particleCount]);

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

    // Use document-level mouse tracking for better detection
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse is inside container
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.isMoving = true;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -100;
      mouseRef.current.y = -100;
      mouseRef.current.isMoving = false;
    };

    // Track at document level for better responsiveness
    document.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ pointerEvents: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
