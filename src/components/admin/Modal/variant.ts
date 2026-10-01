import { tv } from "tailwind-variants";

export const modalVariant = tv({
  base: "duration-300 fixed top-0 left-0 w-full h-full bg-gray-900/30 backdrop-blur-md flex items-center justify-center p-4 max-sm:p-3 z-999",
  variants: {
    variant: {
      opened: "opacity-100 visible",
      closed: "opacity-0 invisible pointer-events-none hidden",
    },
  },
  defaultVariants: {
    variant: "closed",
  },
});
