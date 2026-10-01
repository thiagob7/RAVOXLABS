import clsx from "clsx";
import { tv, VariantProps } from "tailwind-variants";

const defaultButtonStyles = clsx("border-blue-500 bg-blue-500 text-white");

export const buttonVariant = tv({
  base: "flex items-center justify-center h-10 cursor-pointer px-3 text-center text-sm duration-300 border border-transparent outline-none focus-visible:border-blue-500 focus-visible:ring-0 disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-bg disabled:text-disabled-foreground disabled:opacity-100 disabled:shadow-none data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:border-disabled-border data-disabled:bg-disabled-bg data-disabled:text-disabled-foreground data-disabled:opacity-100 data-disabled:shadow-none font-medium text-nowrap not-disabled:hover:brightness-120",
  variants: {
    variant: {
      light:
        "border-gray-700 text-gray-100 bg-gray-800 not-disabled:hover:bg-gray-700 not-disabled:hover:text-gray-100 not-disabled:hover:brightness-100",
      "light-green":
        "border-blue-500/35 bg-blue-500/15 text-blue-500 hover:bg-blue-500/22",
      "light-red":
        "border-red-400/70 text-red-400 bg-red-400/15 not-disabled:hover:bg-red-400/22",
      "light-yellow":
        "border-yellow-200/50 bg-warning-subtle text-yellow-200 not-disabled:hover:brightness-95",
      default: defaultButtonStyles,
      warning: "border-warning-fill bg-warning-fill text-warning-foreground",
      danger: "border-red-400 bg-red-400 text-gray-950",
      success: defaultButtonStyles,
    },
    size: {
      sm: "h-9 px-2.5 text-sm rounded-md",
      md: "h-10 px-3 text-base rounded-lg",
      lg: "h-12 px-4 text-[1.125rem] rounded-lg",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "default",
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariant>;
