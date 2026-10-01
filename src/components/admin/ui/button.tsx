import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-lg border border-transparent bg-clip-padding text-sm font-medium inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none group/button select-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30 focus-visible:border-blue-500",
  {
    variants: {
      variant: {
        default: clsx(
          "bg-blue-500 text-gray-900",
          "hover:bg-green-600 active:brightness-95"
        ),
        outline: clsx(
          "border-gray-700 bg-transparent text-white",
          "hover:bg-gray-800 active:bg-gray-700",
          "aria-expanded:bg-gray-800 aria-expanded:text-white"
        ),
        secondary: clsx(
          "bg-gray-800 text-white",
          "hover:brightness-95 active:brightness-90",
          "aria-expanded:bg-red-400 aria-expanded:text-white"
        ),
        ghost: clsx(
          "bg-transparent text-white",
          "hover:bg-gray-700 active:bg-gray-700",
          "aria-expanded:bg-gray-800 aria-expanded:text-white"
        ),
        destructive: clsx(
          "bg-red-400/15 text-red-400 border-red-400/40",
          "hover:bg-red-400/25 active:bg-red-400/35",
          "focus-visible:ring-red-400/25 focus-visible:border-red-400"
        ),
        link: clsx(
          "bg-transparent text-blue-500 underline-offset-4",
          "hover:underline focus-visible:underline"
        ),
      },
      size: {
        default: clsx(
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
        ),
        xs: clsx(
          'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3'
        ),
        sm: clsx(
          'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3.5'
        ),
        lg: clsx(
          "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3"
        ),
        icon: clsx("size-8"),
        "icon-xs": clsx(
          'size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*="size-"])]:size-3'
        ),
        "icon-sm": clsx(
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg"
        ),
        "icon-lg": clsx("size-9"),
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export { Button, buttonVariants };
