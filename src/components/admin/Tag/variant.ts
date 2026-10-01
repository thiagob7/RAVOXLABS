import { tv, VariantProps } from "tailwind-variants";

export const tagVariant = tv({
  base: "flex items-center justify-center gap-1.5 rounded-full whitespace-nowrap border",
  variants: {
    tone: {
      neutral: "bg-gray-500/20 text-gray-300 border-gray-500",
      success: "bg-green-400/10 text-green-400 border-green-400/40",
      warning: "bg-warning-subtle text-yellow-200 border-yellow-200/40",
      danger: "bg-red-400/10 text-red-400 border-red-400/40",
      info: "bg-blue-400/10 text-blue-400 border-blue-400/40",
      primary: "bg-blue-500/10 text-blue-500 border-blue-500/40",
      accent: "bg-purple-400/10 text-purple-400 border-purple-400/40",
    },
    size: {
      xs: "text-xs py-0.5 px-2",
      md: "text-xs py-1 px-2",
      lg: "text-xs py-1 px-3",
      xl: "text-sm font-semibold py-1 px-3",
    },
    withBorder: {
      true: "border",
      false: "",
    },
    truncate: {
      true: "min-w-0",
      false: "",
    },
  },
  defaultVariants: {
    tone: "neutral",
    size: "xs",
    withBorder: false,
    truncate: false,
  },
});

export type TagVariantProps = VariantProps<typeof tagVariant>;
export type TagTone = NonNullable<TagVariantProps["tone"]>;
