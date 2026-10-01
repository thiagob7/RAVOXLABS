"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import styles from "./GooeyNav.module.css";

// Adaptado de https://www.reactbits.dev/components/gooey-nav

export interface GooeyNavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  /** Item ativo vindo de fora (ex.: scroll spy). -1 esconde a pílula. */
  activeIndex?: number;
  onItemClick?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: GooeyNavItem,
    index: number
  ) => void;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: string[];
  className?: string;
}

const noise = (n = 1) => n / 2 - Math.random() * n;

const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
  const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
  return [distance * Math.cos(angle), distance * Math.sin(angle)];
};

export function GooeyNav({
  items,
  activeIndex = 0,
  onItemClick,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = ["#6467F2", "#FFFFFF", "#3A86FF", "#6467F2", "#FFFFFF"],
  className = "",
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(activeIndex);
  const gooId = `goo-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const makeParticles = (element: HTMLElement) => {
    const [d0, d1] = particleDistances;
    element.style.setProperty(
      "--time",
      `${animationTime * 2 + timeVariance}ms`
    );

    for (let i = 0; i < particleCount; i++) {
      const time = animationTime * 2 + noise(timeVariance * 2);
      const rotate = noise(particleR / 10);
      const start = getXY(d0, particleCount - i, particleCount);
      const end = getXY(d1 + noise(7), particleCount - i, particleCount);
      const color = colors[Math.floor(Math.random() * colors.length)];

      element.classList.remove(styles.active);

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.className = styles.particle;
        particle.style.setProperty("--start-x", `${start[0]}px`);
        particle.style.setProperty("--start-y", `${start[1]}px`);
        particle.style.setProperty("--end-x", `${end[0]}px`);
        particle.style.setProperty("--end-y", `${end[1]}px`);
        particle.style.setProperty("--time", `${time}ms`);
        particle.style.setProperty("--scale", `${1 + noise(0.2)}`);
        particle.style.setProperty("--color", color);
        particle.style.setProperty(
          "--rotate",
          `${rotate > 0 ? (rotate + particleR / 20) * 10 : (rotate - particleR / 20) * 10}deg`
        );
        point.className = styles.point;
        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => element.classList.add(styles.active));
        setTimeout(() => particle.remove(), time);
      }, 30);
    }
  };

  const updateEffectPosition = useCallback((element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const box = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, box);
    Object.assign(textRef.current.style, box);
    textRef.current.innerText = element.innerText;
  }, []);

  const replayPill = () => {
    const text = textRef.current;
    const filter = filterRef.current;
    if (!text || !filter) return;
    text.classList.remove(styles.active);
    filter.classList.remove(styles.active);
    void text.offsetWidth;
    text.classList.add(styles.active);
    filter.classList.add(styles.active);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    onItemClick?.(e, items[index], index);
    const li = e.currentTarget.parentElement;
    if (!li || active === index) return;

    setActive(index);
    updateEffectPosition(li);

    const filter = filterRef.current;
    if (filter) {
      filter.querySelectorAll(`.${styles.particle}`).forEach((p) => p.remove());
    }
    if (textRef.current) {
      textRef.current.classList.remove(styles.active);
      void textRef.current.offsetWidth;
      textRef.current.classList.add(styles.active);
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (filter && !reduceMotion) makeParticles(filter);
    else replayPill();
  };

  // Sincroniza com o item ativo externo (scroll) sem disparar partículas.
  useEffect(() => {
    if (activeIndex === active) return;
    setActive(activeIndex);
    const li = navRef.current?.querySelectorAll("li")[activeIndex];
    if (li) {
      updateEffectPosition(li as HTMLElement);
      replayPill();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // Mantém a pílula alinhada em resize / troca de fonte.
  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const place = () => {
      const li = navRef.current?.querySelectorAll("li")[active];
      if (li) {
        updateEffectPosition(li as HTMLElement);
        textRef.current?.classList.add(styles.active);
      }
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [active, updateEffectPosition]);

  const hidden = active < 0 ? styles.hidden : "";

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      style={{ "--goo-filter": `url(#${gooId})` } as React.CSSProperties}
    >
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <defs>
          <filter id={gooId} x="-200%" y="-400%" width="500%" height="900%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <nav aria-label="Navegação principal">
        <ul ref={navRef} className={styles.list}>
          {items.map((item, index) => (
            <li
              key={item.href}
              className={`${styles.item} ${active === index ? styles.active : ""}`}
            >
              <Link
                href={item.href}
                className={styles.link}
                aria-current={active === index ? "true" : undefined}
                onClick={(e) => handleClick(e, index)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <span
        ref={filterRef}
        className={`${styles.effect} ${styles.filter} ${hidden}`}
      />
      <span
        ref={textRef}
        className={`${styles.effect} ${styles.text} ${hidden}`}
      />
    </div>
  );
}
