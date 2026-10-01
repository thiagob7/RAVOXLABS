"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface CurvedTextLoopProps {
  /** Itens de um ciclo. São repetidos até cobrir a curva. */
  items: string[];
  /** Versão curta para telas estreitas, onde cabem poucos itens. */
  compactItems?: string[];
  /** Pixels por segundo, no sistema de coordenadas do SVG. */
  speed?: number;
  className?: string;
}

const clamp = (min: number, value: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Toda a geometria sai da largura disponível, então o desenho é o mesmo em
 * qualquer tela: uma onda inteira atravessando, com o texto proporcional.
 * O viewBox usa a largura real, ou seja, 1 unidade = 1 pixel.
 */
function layoutFor(width: number) {
  // Proporção maior em tela estreita: 4% de 390px daria um texto apagado.
  const fontSize = clamp(22, width * 0.055, 58);
  // Amplitude generosa: com pouco, a curva lê como uma linha torta.
  const amplitude = clamp(16, width * 0.085, 118);
  // Cada corcova ocupa perto de meia tela, para caber um "S" inteiro. O piso
  // de 460 evita que, no celular, a curva toda aconteça dentro de uma palavra.
  const hump = Math.max(460, width * 0.46);
  const height = Math.round(amplitude * 2 + fontSize * 1.5);
  return {
    fontSize,
    amplitude,
    hump,
    height,
    middle: height / 2 + fontSize * 0.34,
  };
}

/** Monta a curva larga o bastante para atravessar a tela inteira. */
function buildWave(
  width: number,
  hump: number,
  amplitude: number,
  middle: number
) {
  // Sobra de ondas inteiras: começando no meio de uma onda, a parte visível
  // ficaria fora de fase e leria como diagonal em vez de S.
  const overhang = hump;
  const start = -overhang;
  const end = width + overhang;
  let d = `M ${start} ${middle} C ${start + hump * 0.3} ${middle - amplitude}, ${start + hump * 0.7} ${middle - amplitude}, ${start + hump} ${middle}`;
  let x = start + hump;
  let down = true;
  while (x < end) {
    const next = x + hump;
    const control = down ? middle + amplitude : middle - amplitude;
    d += ` S ${x + hump * 0.7} ${control}, ${next} ${middle}`;
    x = next;
    down = !down;
  }
  return d;
}

/**
 * Tipografia grande correndo por uma curva suave — o texto é a faixa, sem
 * fita colorida atrás. O deslocamento anda até o tamanho de um ciclo e volta
 * a zero: como as repetições são iguais, o salto não aparece.
 */
/** Abaixo disso, os rótulos longos ocupariam a tela toda. */
const COMPACT_WIDTH = 700;

export function CurvedTextLoop({
  items,
  compactItems,
  speed = 34,
  className,
}: CurvedTextLoopProps) {
  const id = useId();
  const safeId = id.replace(/[^a-zA-Z0-9]/g, "");
  const pathId = `curved-loop-${safeId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const offsetRef = useRef(0);
  /** Empurrão vindo da rolagem, sempre voltando a zero. */
  const boostRef = useRef(0);
  const targetBoostRef = useRef(0);
  /** 1 = velocidade normal; cai para 0,3 com o ponteiro em cima. */
  const factorRef = useRef(1);
  const hoverRef = useRef(false);
  const [repeats, setRepeats] = useState(2);
  const [viewWidth, setViewWidth] = useState(1200);
  const { fontSize, amplitude, hump, height, middle } = layoutFor(viewWidth);
  const wave = buildWave(viewWidth, hump, amplitude, middle);
  const shown =
    compactItems && viewWidth < COMPACT_WIDTH ? compactItems : items;
  const label = items.join(" · ");

  // O viewBox acompanha a largura real da caixa.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => setViewWidth(Math.max(320, container.clientWidth));

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const measure = measureRef.current;
    const container = containerRef.current;
    if (!path || !measure || !container) return;

    const cycle = measure.getComputedTextLength();
    if (!cycle) return;

    // Uma volta a mais evita o texto acabar antes do fim da curva.
    setRepeats(Math.ceil(path.getTotalLength() / cycle) + 1);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    let frame = 0;
    let last = 0;
    let running = false;
    let lastScroll = window.scrollY;
    let lastScrollAt = performance.now();

    const wrap = (value: number) => ((value % cycle) + cycle) % cycle;

    const step = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;

      // Aproximações exponenciais: o resultado não depende da taxa de quadros.
      const ease = 1 - Math.pow(0.001, delta);
      factorRef.current +=
        ((hoverRef.current ? 0.3 : 1) - factorRef.current) * ease;
      boostRef.current += (targetBoostRef.current - boostRef.current) * ease;
      targetBoostRef.current *= Math.pow(0.05, delta);

      offsetRef.current = wrap(
        offsetRef.current +
          (speed * factorRef.current + boostRef.current) * delta
      );
      // Atributo direto: reagendar o React a cada quadro custaria caro aqui.
      textPathRef.current?.setAttribute(
        "startOffset",
        String(-offsetRef.current)
      );

      frame = requestAnimationFrame(step);
    };

    // A rolagem acelera o texto e, para cima, inverte o sentido.
    const onScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(now - lastScrollAt, 16) / 1000;
      const velocity = (window.scrollY - lastScroll) / elapsed;
      lastScroll = window.scrollY;
      lastScrollAt = now;
      targetBoostRef.current = Math.max(-900, Math.min(900, velocity * 0.45));
    };

    const onEnter = () => (hoverRef.current = true);
    const onLeave = () => (hoverRef.current = false);

    window.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);

    // Fora da tela não precisa animar.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) {
          last = 0;
          frame = requestAnimationFrame(step);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0 }
    );
    visibility.observe(container);

    return () => {
      window.removeEventListener("scroll", onScroll);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      visibility.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [speed, shown, wave, fontSize]);

  const cycleContent = (keyPrefix: string) =>
    shown.map((item, index) => (
      <Fragment key={`${keyPrefix}-${index}`}>
        <tspan>{item}</tspan>
        <tspan className="fill-blue-500">{" • "}</tspan>
      </Fragment>
    ));

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-hidden",
        // Esmaece nas pontas em vez de cortar o texto no meio de uma palavra.
        "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${height}`}
        className="w-full"
        role="img"
        aria-label={label}
      >
        <defs>
          <path id={pathId} ref={pathRef} d={wave} fill="none" />
        </defs>

        {/* Só para medir um ciclo; não aparece. */}
        <text
          ref={measureRef}
          className="fill-transparent font-bold uppercase tracking-[0.04em]"
          style={{ fontSize }}
          x={-9999}
          y={-9999}
          aria-hidden
        >
          {cycleContent("measure")}
        </text>

        <text
          className="fill-gray-100 font-bold uppercase tracking-[0.04em]"
          style={{ fontSize }}
        >
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset={0}>
            {Array.from({ length: repeats }, (_, index) =>
              cycleContent(`cycle-${index}`)
            )}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
