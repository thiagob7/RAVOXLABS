import { tv, VariantProps } from "tailwind-variants";

export const pageHeaderVariant = tv({
  base: "flex",
  variants: {
    variant: {
      col: "flex-col items-start",
      row: "flex-row",
    },
  },
  defaultVariants: {
    variant: "row",
  },
});

export type PageHeaderVariant = VariantProps<typeof pageHeaderVariant>;
