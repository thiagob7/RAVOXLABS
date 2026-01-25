"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

interface InteractiveGridProps {
  className?: string;
  gridSize?: number;
  pointSize?: number;
  lineOpacity?: number;
  mouseRadius?: number;
  color?: string;
}

export function InteractiveGrid({
  className = "",
  gridSize = 50,
  pointSize = 2,
  lineOpacity = 0.15,
  mouseRadius = 150,
  color = "100, 103, 242", // RGB format for the blue color
}: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const initPoints = useCallback((width: number, height: number) => {
    const points: Point[] = [];
    const cols = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * gridSize;
        const y = j * gridSize;
        points.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
        });
      }
    }

    return points;
  }, [gridSize]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const points = pointsRef.current;
    const mouse = mouseRef.current;

    // Update points
    points.forEach((point) => {
      // Calculate distance from mouse
      const dx = mouse.x - point.x;
      const dy = mouse.y - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius) {
        // Push point away from mouse
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        const pushX = Math.cos(angle) * force * 30;
        const pushY = Math.sin(angle) * force * 30;

        point.vx -= pushX * 0.02;
        point.vy -= pushY * 0.02;
      }

      // Spring back to origin
      const springX = (point.originX - point.x) * 0.05;
      const springY = (point.originY - point.y) * 0.05;

      point.vx += springX;
      point.vy += springY;

      // Apply friction
      point.vx *= 0.9;
      point.vy *= 0.9;

      // Update position
      point.x += point.vx;
      point.y += point.vy;
    });

    // Draw connections
    ctx.strokeStyle = `rgba(${color}, ${lineOpacity})`;
    ctx.lineWidth = 1;

    points.forEach((point, i) => {
      points.slice(i + 1).forEach((other) => {
        const dx = point.x - other.x;
        const dy = point.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < gridSize * 1.5) {
          const opacity = 1 - dist / (gridSize * 1.5);
          ctx.strokeStyle = `rgba(${color}, ${lineOpacity * opacity})`;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    // Draw points
    points.forEach((point) => {
      const dx = mouse.x - point.x;
      const dy = mouse.y - point.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Increase size and opacity when near mouse
      const proximity = Math.max(0, 1 - dist / mouseRadius);
      const size = pointSize + proximity * 3;
      const alpha = 0.3 + proximity * 0.7;

      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect for points near mouse
      if (proximity > 0.3) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${color}, ${proximity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [color, gridSize, lineOpacity, mouseRadius, pointSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      pointsRef.current = initPoints(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
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
  }, [animate, initPoints]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
