"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
}

interface InteractiveParticlesProps {
  className?: string;
  particleCount?: number;
  color?: string;
  lineColor?: string;
  maxDistance?: number;
  mouseRadius?: number;
  mouseForce?: number;
}

export function InteractiveParticles({
  className = "",
  particleCount = 80,
  color = "100, 103, 242",
  lineColor = "100, 103, 242",
  maxDistance = 150,
  mouseRadius = 150,
  mouseForce = 8,
}: InteractiveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1.5,
      });
    }
    particlesRef.current = particles;
  }, [particleCount]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    const mouse = mouseRef.current;

    // Update particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Calculate distance from mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Mouse repulsion effect
      if (distance < mouseRadius && distance > 0) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.vx -= Math.cos(angle) * force * mouseForce;
        p.vy -= Math.sin(angle) * force * mouseForce;
      }

      // Return to base position (spring effect)
      const returnForce = 0.03;
      p.vx += (p.baseX - p.x) * returnForce;
      p.vy += (p.baseY - p.y) * returnForce;

      // Apply friction
      p.vx *= 0.92;
      p.vy *= 0.92;

      // Update position
      p.x += p.vx;
      p.y += p.vy;
    }

    // Draw lines between nearby particles
    ctx.strokeStyle = `rgba(${lineColor}, 0.15)`;
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.4;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // Draw lines from mouse to nearby particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius * 1.5) {
        const opacity = (1 - distance / (mouseRadius * 1.5)) * 0.3;
        ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    }

    // Draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Distance from mouse for glow effect
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const isNearMouse = distance < mouseRadius * 1.2;

      // Outer glow
      const glowSize = isNearMouse ? p.size * 4 : p.size * 2.5;
      const glowOpacity = isNearMouse ? 0.4 : 0.2;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
      gradient.addColorStop(0, `rgba(${color}, ${glowOpacity})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core particle
      const coreOpacity = isNearMouse ? 1 : 0.7;
      const coreSize = isNearMouse ? p.size * 1.3 : p.size;
      ctx.beginPath();
      ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${coreOpacity})`;
      ctx.fill();

      // Bright center
      if (isNearMouse) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, coreSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.fill();
      }
    }

    // Draw mouse glow
    if (mouse.x > 0 && mouse.y > 0) {
      const mouseGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, mouseRadius
      );
      mouseGlow.addColorStop(0, `rgba(${color}, 0.15)`);
      mouseGlow.addColorStop(0.5, `rgba(${color}, 0.05)`);
      mouseGlow.addColorStop(1, `rgba(${color}, 0)`);

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
      ctx.fillStyle = mouseGlow;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [color, lineColor, maxDistance, mouseRadius, mouseForce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current.x = x;
        mouseRef.current.y = y;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    document.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, initParticles]);

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
