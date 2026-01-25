import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex text-nowrap max-h-[48px] items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-[var(--font-inter)]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-500 text-white hover:bg-blue-500/80 focus:ring-blue-500",
        outline:
          "border border-white text-white hover:bg-white hover:text-gray-900 focus:ring-blue-500",
        ghost: "text-blue-500 hover:bg-blue-500/10 focus:ring-blue-500",
        white: "bg-gray-100 text-gray-900 hover:bg-white/80 focus:ring-white",
      },
      size: {
        default: "h-[48px] px-6 py-3 text-base",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface BaseButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

interface ButtonWithHref extends BaseButtonProps {
  href: string;
}

interface ButtonWithoutHref extends BaseButtonProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

type ButtonProps = ButtonWithHref | ButtonWithoutHref;

export function Button({
  children,
  href,
  variant,
  size,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const buttonClasses = cn(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={buttonClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      {...(props as {
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
      })}
    >
      {children}
    </button>
  );
}
