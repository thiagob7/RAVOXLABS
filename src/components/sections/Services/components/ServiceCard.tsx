"use client";

import { useInView } from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";
import { FiArrowRight } from "react-icons/fi";

import type {
  AnimatedIcon,
  AnimatedIconHandle,
} from "@/components/ui/animated-icon";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: AnimatedIcon;
  title: string;
  description: string;
  /** Para onde o "Solicitar orçamento" leva. */
  href: string;
  index: number;
  /** Card grande, com ilustração acima do texto. */
  featured?: boolean;
  /** Faixa larga: texto à esquerda e ação à direita (no desktop). */
  wide?: boolean;
  visual?: ReactNode;
  className?: string;
}

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  href,
  index,
  featured = false,
  wide = false,
  visual,
  className,
}: ServiceCardProps) => {
  const iconRef = useRef<AnimatedIconHandle>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, amount: 0.5 });

  // Toca a animação do ícone quando o card aparece, em cascata.
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(
      () => iconRef.current?.startAnimation(),
      300 + index * 180
    );
    return () => clearTimeout(timer);
  }, [inView, index]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.01] transition-colors duration-300 hover:border-blue-500/30",
        featured ? "p-7 md:p-8" : "p-7",
        wide && "lg:flex-row lg:items-center lg:justify-between lg:gap-10",
        className
      )}
    >
      {/* Brilho no canto ao passar o mouse */}
      <span className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {featured && visual && <div className="relative mb-8">{visual}</div>}

      <div
        className={cn(
          "relative flex gap-4",
          featured ? "flex-col" : "items-start"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-4 text-blue-500",
            !featured && "pt-0.5"
          )}
        >
          <Icon ref={iconRef} size={featured ? 34 : 30} />
          {featured && (
            <h3 className="text-2xl font-semibold text-gray-100 md:text-[28px]">
              {title}
            </h3>
          )}
        </div>

        <div>
          {!featured && (
            <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          )}
          <p
            className={cn(
              "leading-relaxed text-gray-400",
              featured ? "max-w-md text-base" : "mt-1.5 text-[15px]"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "relative mt-auto flex items-center justify-between pt-8",
          wide && "lg:mt-0 lg:shrink-0 lg:gap-6 lg:pt-0"
        )}
      >
        <Link
          href={href}
          className={cn(
            "text-sm font-medium transition-colors duration-300",
            featured
              ? "text-blue-500 hover:text-[#8B8DF7]"
              : "text-gray-100 hover:text-blue-500"
          )}
        >
          Solicitar orçamento
        </Link>
        <Link
          href={href}
          aria-label={`Solicitar orçamento de ${title}`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-500/60 text-gray-100 transition-all duration-300 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white"
        >
          <FiArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-45" />
        </Link>
      </div>
    </div>
  );
};
